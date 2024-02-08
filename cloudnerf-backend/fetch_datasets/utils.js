import { spawnSync } from "child_process";
import { createReadStream, mkdirSync, rmdirSync } from "fs";
import { supabase } from "../supabaseClient.js";

export const datasetFetchIds = ["blender"];

export function downloadDataset(config) {
	console.log("Creating temporary directory for dataset download");
	const tmpDir = tmpDirForDatasetFetching(config);
	mkdirSync(tmpDir, { recursive: true });
	console.log("Directory path:", tmpDir);

	console.log(
		`Starting download (cmd: ${config.cmd}, args: ${config.cdmArgs})`,
	);
	const downloadProcess = spawnSync(config.cmd, config.cdmArgs, {
		shell: true, // for windows
	});
	console.log(
		"Download finished",
		`\nSTDERR: ${downloadProcess.stderr}`,
		`\nSTDOUT: ${downloadProcess.stdout}`,
	);
	return downloadProcess;
}

export async function uploadDatasetsToSupabase(config, datasetName) {
	console.log("Creating bucket");
	const bucket = await supabase.storage.createBucket("datasets", {
		public: true,
	});
	console.log("Bucket:", bucket);

	for (const path of config.datasetPaths){
		console.log(path)
	}

	console.log("Uploading to supabase bucket");
	await supabase.storage
		.from("datasets")
		.upload(`${config.fetchId}/${datasetName}.zip`, content, {
			duplex: "half",
		});
}

export function cleanUp(config) {
	rmdirSync(tmpDirForDatasetFetching(config));
}

function tmpDirForDatasetFetching(config) {
	return `${process.env.REACT_APP_ROOT_DIR}/tmp/${config.fetchId}`;
}
