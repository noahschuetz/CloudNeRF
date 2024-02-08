import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { supabase } from "../supabaseClient.js";
import { spawnSync } from "child_process";

export async function loadDatasetIntoTemporaryDirectory(modelId, datasetId) {
	console.log("Creating tmp dir");
	const tmpDir = tmpDirForModelRun(modelId);
	mkdirSync(tmpDir, {
		recursive: true,
	});

	console.log("Reading contents of dataset...");
	const { data: datasetContents } = await supabase.storage
		.from("datasets")
		.list(datasetId);

	const assetDir = datasetContents.filter((d) => d.id === null)[0].name;
	mkdirSync(path.join(tmpDir, assetDir), { recursive: true });

	const { data: assetDirContents } = await supabase.storage
		.from("datasets")
		.list(`${datasetId}/${assetDir}`);

	// transforms file download
	console.log("Downloading transforms file...");
	const { data } = await supabase.storage
		.from("datasets")
		.download(`${datasetId}/transforms.json`);

	const buffer = Buffer.from(await data.arrayBuffer());
	writeFileSync(path.join(tmpDir, "transforms.json"), buffer);

	// assets donwload
	console.log("Downloading assets...");
	for (const assetFile of assetDirContents) {
		const filename = assetFile.name;
		const { data } = await supabase.storage
			.from("datasets")
			.download(`${datasetId}/${assetDir}/${filename}`);
		const buffer = Buffer.from(await data.arrayBuffer());
		writeFileSync(path.join(tmpDir, assetDir, filename), buffer);
		console.log(`Got ${filename}`);
	}
}

export function runModel(config) {
	console.log("Starting training process");
	const trainingProcess = spawnSync(config.cmd, config.cmdArgs, {
		shell: true, // for windows
	});
	console.log(
		"Download finished",
		`\nSTDERR: ${trainingProcess.stderr}`,
		`\nSTDOUT: ${trainingProcess.stdout}`,
	);
}

function tmpDirForModelRun(modelId) {
	return path.join(process.env.ROOT_DIR, "tmp", modelId, "data");
}
