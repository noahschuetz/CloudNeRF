import {
	chmodSync,
	mkdirSync,
	readFileSync,
} from "fs";
import path, { join } from "path";
import { supabase } from "../supabaseClient.js";
import { spawn } from "child_process";
import { writeFile } from "fs/promises";

export async function loadDatasetIntoTemporaryDirectory(modelId, datasetId) {
	console.log("Creating tmp dir");
	const tmpDir = tmpDirForModelRun(modelId);

	mkdirSync(tmpDir, {
		recursive: true,
		mode: 0o777,
	});
	chmodSync(tmpDir, 0o777);

	console.log("Loading dataset into temporary directory");
	await loadDatasetFilesRecursive(datasetId, path.join(tmpDir, "data"));
}

async function loadDatasetFilesRecursive(basedir, tmpDir) {
	const currentDir = path.join(tmpDir, basedir);

	mkdirSync(currentDir, {
		recursive: true,
		mode: 0o777,
	});
	chmodSync(currentDir, 0o777);

	const { data: dirContents } = await supabase.storage
		.from("datasets")
		.list(basedir, {limit: 10000});

	for (const element of dirContents) {
		if (element.id === null) {
			// directory
			loadDatasetFilesRecursive(`${basedir}/${element.name}`, tmpDir);
		} else {
			const { data } = await supabase.storage
				.from("datasets")
				.download(`${basedir}/${element.name}`);
			const buffer = Buffer.from(await data.arrayBuffer());
			writeFile(path.join(tmpDir, basedir, element.name), buffer);
		}
	}
}

export function installModel(config) {
	console.log("Installing docker image for model...");
	console.log(config.installCmd.join(" "));

	const installProcess = spawn(config.installCmd[0], config.installCmd.slice(1), {
		shell: true, // for windows
	});

	pipeOutputOfChildProcess(
		installProcess,
		`installing model ${config.modelId}`,
	);

	return installProcess;
}

export function runModel(config, datasetId) {
	console.log("Starting training process");

	const info = JSON.parse(
		readFileSync(
			path.join(
				tmpDirForModelRun(config.modelId),
				"data",
				datasetId,
				"info.json",
			),
		).toString("utf-8"),
	);

	const runCommand = config.runCmdFn(datasetId, info.datasetType);
	console.log(runCommand.join(" "));

	const trainingProcess = spawn(runCommand[0], runCommand.slice(1), {
		shell: true, // for windows
	});

	pipeOutputOfChildProcess(trainingProcess, `training model ${config.modelId}`);

	return trainingProcess;
}

export function exportModel(config, datasetId) {
	console.log("Exporting model as mesh...");

	const tmpDir = tmpDirForModelRun(config.modelId);

	const info = JSON.parse(
		readFileSync(path.join(tmpDir, "data", datasetId, "info.json")).toString(
			"utf-8",
		),
	);

	const exportCommand = config.exportCmdFn(datasetId);

	console.log(exportCommand);

	const exportProcess = spawn(exportCommand[0], exportCommand.slice(1), {
		shell: true, //windows
	});

	exportProcess.once("close", async () => {
		console.log("Creating results bucket")
		const bucket = await supabase.storage.createBucket("results");
		if (bucket.error) {
			console.log(bucket.error.message);
		}

		const meshId = `${config.modelId}__${datasetId}`

		const meshContent = readFileSync(
			join(tmpDir, process.env.MESH_RESULTS_DIR_NAME, config.exportedMeshFile),
		);
		console.log(`Uploading ${config.exportedMeshFile}`)
		await supabase.storage
			.from("results")
			.upload(`${meshId}/mesh/${config.exportedMeshFile}`, meshContent);

		console.log("Uploading info.json")
		const infoContent= JSON.stringify({name: `${meshId}`})
		await supabase.storage
			.from("results")
			.upload(`${meshId}/info.json`, infoContent);
	});

	pipeOutputOfChildProcess(exportProcess, `exporting model ${config.modelId}`);
}

function tmpDirForModelRun(modelId) {
	console.log(process.env.ROOT_DIR)
	const tmpDir = path.join(process.env.ROOT_DIR, "tmp", modelId);
	console.log(`Created tmp dir ${tmpDir}`)
	return tmpDir;
}

export function pipeOutputOfChildProcess(process, id) {
	process.stdout.on("data", (m) => {
		console.log(`\x1b[45m [${id} (stdout/data)]: \x1b[0m`);
		console.log(m.toString());
	});
	process.stdout.on("error", (m) => {
		console.log(`\x1b[45m [${id} (stdout/error)]: \x1b[0m`);
		console.log(m.toString());
	});
	process.stderr.on("data", (m) => {
		console.log(`\x1b[45m [${id} (stderr/data)]: \x1b[0m`);
		console.log(m.toString());
	});
	process.stderr.on("error", (m) => {
		console.log(`\x1b[45m [${id} (stderr/error)]: \x1b[0m`);
		console.log(m.toString());
	});

	process.on("close", () =>
		console.log(`\n\n\n\n\x1b[42m\x1b[30mFINISHED ${id}\x1b[0m\n\n\n\n`),
	);
}
