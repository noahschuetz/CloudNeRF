import { chmodSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
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
	mkdirSync(path.join(tmpDir, assetDir), { recursive: true });

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

export function runModel(config) {
	console.log("Starting training process");
	const trainingProcess = spawn(config.runCmd, config.runCmdArgs, {
		shell: true, // for windows
	});
	
	pipeOutputOfChildProcess(trainingProcess, `training model ${config.modelId}`)

	trainingProcess.on("close", () =>
		console.log("\n\n\n\nFINISHED TRAINING MODEL\n\n\n\n"),
	);
}

export function installModel(config) {
	console.log("Installing docker image for modell...");
	console.log(config.installCmd, config.installCmdArgs);

	const installProcess = spawn(config.installCmd, config.installCmdArgs, {
		shell: true, // for windows
	});

	pipeOutputOfChildProcess(installProcess, `installing model ${config.modelId}`)

	installProcess.on("close", () =>
		console.log("\n\n\n\nFINISHED INSTALLING MODEL\n\n\n\n"),
	);
}

function tmpDirForModelRun(modelId) {
	return path.join(process.env.ROOT_DIR, "tmp", modelId);
}

function pipeOutputOfChildProcess(process, id){
	process.stdout.on("data", (m) =>
		console.log(`${id}: STDOUT DATA ${m.toString()}`),
	);
	process.stdout.on("error", (m) =>
		console.log(`${id}: STDOUT ERROR ${m.toString()}`),
	);
	process.stderr.on("data", (m) =>
		console.log(`${id}: STDERR DATA ${m.toString()}`),
	);
	process.stderr.on("error", (m) =>
		console.log(`${id}: STDERR ERROR ${m.toString()}`),
	);

	process.on("close", () =>
		console.log("\n\n\n\nFINISHED INSTALLING MODEL\n\n\n\n"),
	);
}
