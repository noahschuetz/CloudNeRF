import {
	chmodSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from "fs";
import path, { join } from "path";
import { supabase } from "../supabaseClient.js";
import { spawn } from "child_process";

export async function loadDatasetIntoTemporaryDirectory(modelId, datasetId) {
	console.log("Creating tmp dir");
	const tmpDir = tmpDirForModelRun(modelId);
	mkdirSync(tmpDir, {
		recursive: true,
		mode: 0o777,
	});
	chmodSync(tmpDir, 0o777);

	console.log("Reading contents of dataset...");
	const { data: datasetContents } = await supabase.storage
		.from("datasets")
		.list(datasetId);

	// images download
	const assetDir = datasetContents.filter((d) => d.id === null)[0].name;
	mkdirSync(path.join(tmpDir, "data", assetDir), { recursive: true });

	const { data: assetDirContents } = await supabase.storage
		.from("datasets")
		.list(`${datasetId}/${assetDir}`, { limit: 1000 });

	console.log("Downloading assets...");
	for (const assetFile of assetDirContents) {
		const filename = assetFile.name;
		const { data } = await supabase.storage
			.from("datasets")
			.download(`${datasetId}/${assetDir}/${filename}`);
		const buffer = Buffer.from(await data.arrayBuffer());
		writeFileSync(path.join(tmpDir, "data", assetDir, filename), buffer);
		console.log(`Got ${filename}`);
	}

	// transforms file download
	console.log("Downloading transforms file...");
	const { data } = await supabase.storage
		.from("datasets")
		.download(`${datasetId}/transforms.json`);

	const buffer = Buffer.from(await data.arrayBuffer());
	writeFileSync(path.join(`${tmpDir}/data`, "transforms.json"), buffer);
}

export function installModel(config) {
	console.log("Installing docker image for model...");
	console.log(config.installCmd, config.installCmdArgs.join(" "));

	const installProcess = spawn(config.installCmd, config.installCmdArgs, {
		shell: true, // for windows
	});

	pipeOutputOfChildProcess(
		installProcess,
		`installing model ${config.modelId}`,
	);
}

export function runModel(config, datasetId) {
	console.log("Starting training process");
	console.log(config.runCmd, config.runCmdArgs.join(" "));

	const trainingProcess = spawn(config.runCmd, config.runCmdArgs, {
		shell: true, // for windows
	});

	trainingProcess.once("close", () => {
		exportModel(config);
	});

	pipeOutputOfChildProcess(trainingProcess, `training model ${config.modelId}`);
}

export function exportModel(config, datasetId) {
	console.log("Exporting model as mesh...");
	console.log(config.exportCmd, config.exportCmdArgs.join(" "));

	const exportProcess = spawn(config.exportCmd, config.exportCmdArgs, {
		shell: true, //windows
	});

	exportProcess.once("close", async () => {
		const tmpDir = tmpDirForModelRun(config);
		const resultFiles = readdirSync(join(tmpDir, "results"));
		for (const rf of resultFiles) {
			const content = readFileSync(join(tmpDir, "results", rf));
			await supabase.storage
				.from("results")
				.upload(`${config.modelId}-${datasetId}/${rf}`, content);
		}
	});

	pipeOutputOfChildProcess(exportProcess, `exporting model ${config.modelId}`);
}

function tmpDirForModelRun(modelId) {
	return path.join(process.env.ROOT_DIR, "tmp", modelId);
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
