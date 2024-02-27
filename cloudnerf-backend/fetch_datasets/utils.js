import { spawn } from "child_process";
import {
	readFileSync,
	mkdirSync,
	readdirSync,
	rmdirSync,
	chmodSync,
	lstatSync,
} from "fs";
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
	console.log("Creating bucket if not already exist");
	const bucket = await supabase.storage.createBucket("datasets");
	if (bucket.error) {
		console.log(bucket.error.message);
	}

	for (const dsPath of config.datasetPaths) {
		const [datasetId, datasetPath] = dsPath;

		const basedir = path.join(tmpDirForDatasetFetching(config), datasetPath);

		const metadata = { numImages: 0 };

		await uploadRecursiveToSupabase(basedir, "", datasetId, metadata);
		await uploadInfoJson(datasetId, config, metadata.numImages)

		console.log(`Finished uploading ${datasetId} of ${config.fetchId}. Found ${metadata.numImages} images`)
	}
}

async function uploadRecursiveToSupabase(
	basedir,
	bucketPath,
	datasetId,
	metadata,
) {
	const currentPath = path.join(basedir, bucketPath);
	for (const element of readdirSync(currentPath)) {
		const stats = lstatSync(path.join(currentPath, element));
		if (stats.isDirectory()) {
			await uploadRecursiveToSupabase(
				basedir,
				path.join(bucketPath, element),
				datasetId,
				metadata,
			);
		} else if (stats.isFile()) {
			if (["png", "jpg", "jpeg"].includes(element.split(".").at(-1).toLowerCase())) {
				metadata.numImages += 1;
			}
			const fileBuffer = readFileSync(path.join(currentPath, element));
			await supabase.storage
				.from("datasets")
				.upload(`${datasetId}/${bucketPath}/${element}`, fileBuffer)
				.then((data, error) => {
					if (error) {
						console.log("error", error);
						res.status(500).send("error");
					}
				});
		} else {
			console.error("Encountered unexpected file type");
		}
	}

	return metadata;
}

async function uploadInfoJson(datasetId, config, numImages){
	const infoJson = JSON.stringify({
		name: datasetId,
		description: config.description,
		images: numImages,
		datasetType: config.datasetType,
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
		});
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
