import { spawn } from "child_process";
import { readFileSync, mkdirSync, readdirSync, rmdirSync, chmodSync } from "fs";
import { supabase } from "../supabaseClient.js";
import path from "path";
import { pipeOutputOfChildProcess } from "../run_models/utils.js";

export function downloadDataset(config) {
	console.log("Creating temporary directory for dataset download");
	const tmpDir = tmpDirForDatasetFetching(config);
	mkdirSync(tmpDir, { recursive: true });
	chmodSync(tmpDir, 0o777);
	console.log("Directory path:", tmpDir);

	console.log(
		`Starting download (cmd: ${config.cmd}, args: ${config.cmdArgs})`,
	);
	const downloadProcess = spawn(config.cmd, config.cmdArgs, {
		shell: true, // windows
	});

	pipeOutputOfChildProcess(downloadProcess, `downloading ${config.fetchId}`);

	return downloadProcess;
}

export async function uploadDatasetsToSupabase(config) {
	console.log("Creating bucket");
	const bucket = await supabase.storage.createBucket("datasets");
	console.log("Bucket:", bucket);
	if (bucket.error) {
		console.log(bucket.error.message);
	}

	for (const dsPath of config.datasetPaths) {
		const dataDir = path.join(tmpDirForDatasetFetching(config), dsPath[1]);
		const transformsDir = path.join(
			tmpDirForDatasetFetching(config),
			dsPath[2],
		);
		const datasetId = dsPath[0];

		console.log("Uploading images");

		for (const filename of readdirSync(dataDir)) {
			const content = readFileSync(path.join(dataDir, filename));
			await supabase.storage
				.from("datasets")
				.upload(`${datasetId}/images/${filename}`, content)
				.then((data, error) => {
					if (error) {
						console.log("error", error);
						res.status(500).send("error");
					}
					console.log("supabase response", data);
				});
		}

		let transformsJson = readFileSync(transformsDir).toString("utf-8");
		transformsJson = fixTransformsJson(transformsJson);
		await supabase.storage
			.from("datasets")
			.upload(`${datasetId}/transforms.json`, transformsJson)
			.then((data, error) => {
				if (error) {
					console.log("error", error);
					res.status(500).send("error");
				}
				console.log("supabase response", data);
			});

		const infoJson = JSON.stringify({
			name: datasetId,
			description: `Dataset ${datasetId} from ${config.fetchId} bundle`,
			images: readdirSync(dataDir).length,
			compatible_models: ["nerfacto", "neus", "instantngp"],
			dataset_bundle: config.fetchId,
		});
		await supabase.storage
			.from("datasets")
			.upload(`${datasetId}/info.json`, infoJson)
			.then((data, error) => {
				if (error) {
					console.log("error", error);
					res.status(500).send("error");
				}
				console.log("supabase response", data);
			});
	}
}

export function fixTransformsJson(transformsJson) {
	const transforms = JSON.parse(transformsJson);
	for (const frame of transforms.frames) {
		if (!/\.\w+$/.test(frame.file_path)) {
			frame.file_path = `${frame.file_path}.png`;
		}
		if (frame.file_path.split("/")[0] === ".") {
			frame.file_path = frame.file_path.substring(2);
		}
		if (frame.file_path.split("/").length > 2) {
			throw Error(
				`expected images to be only one dir deeper than transforms.json! File path is ${frame.file_path}`,
			);
		}
		if (frame.file_path.split("/")[0] !== "images") {
			frame.file_path = `images/${frame.file_path.split("/").at(-1)}`;
		}
	}
	return JSON.stringify(transforms);
}

export function cleanUp(config) {
	rmdirSync(tmpDirForDatasetFetching(config));
}

function tmpDirForDatasetFetching(config) {
	return `${process.env.ROOT_DIR}/tmp/${config.fetchId}`;
}
