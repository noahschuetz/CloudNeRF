import { spawnSync } from "child_process";
import { readFileSync, mkdirSync, readdirSync, rmdirSync } from "fs";
import { supabase } from "../supabase.js";
import path from "path";

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

export async function uploadDatasetsToSupabase(config) {
	console.log("Creating bucket");
	const bucket = await supabase.storage.createBucket("datasets", {
		public: true,
	});
	console.log("Bucket:", bucket);

	for (const dsPath of config.datasetPaths) {
		const dataDir = path.join(tmpDirForDatasetFetching(config), dsPath[1]);
		const transformsDir = path.join(
			tmpDirForDatasetFetching(config),
			dsPath[2],
		);
		const bucketLocation = dsPath[0];
		const bucketDataSubdir = dsPath[1].split("/").at(-1);
		console.log("Uploading images");
		console.log(bucketDataSubdir);
		for (const filename of readdirSync(dataDir)) {
			const content = readFileSync(path.join(dataDir, filename));
			await supabase.storage
				.from("datasets")
				.upload(`${bucketLocation}/${bucketDataSubdir}/${filename}`, content)
				.then((data, error) => {
					if (error) {
						console.log("error", error);
						res.status(500).send("error");
					}
					console.log("supabase response", data);
				});
		}
		const transformsContent = readFileSync(transformsDir);
		await supabase.storage
			.from("datasets")
			.upload(`${bucketLocation}/transforms.json`, transformsContent)
			.then((data, error) => {
				if (error) {
					console.log("error", error);
					res.status(500).send("error");
				}
				console.log("supabase response", data);
			});
	}
}

export function cleanUp(config) {
	rmdirSync(tmpDirForDatasetFetching(config));
}

function tmpDirForDatasetFetching(config) {
	return `${process.env.ROOT_DIR}/tmp/${config.fetchId}`;
}
