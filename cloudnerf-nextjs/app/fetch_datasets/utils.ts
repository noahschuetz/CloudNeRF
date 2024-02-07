import { supabaseServerClient } from "@/supabase/server";
import { assertValue } from "@/utils";
import archiver from "archiver";
import { spawnSync } from "child_process";
import {
	createReadStream,
	createWriteStream,
	mkdirSync,
	open,
	readFile,
	readFileSync,
	rmdirSync,
} from "fs";
import { FetchDatasetConfig } from "./configs";
import { supabaseServiceClient } from "@/supabase/client";

export function downloadDataset(config: FetchDatasetConfig) {
	console.log("Creating temporary directory for dataset download");
	const tmpDir = tmpDirForDatasetFetching(config);
	mkdirSync(tmpDir, { recursive: true });
	console.log("Directory path:", tmpDir);

	console.log(
		`Starting download (cmd: ${config.cmd}, args: ${config.cdmArgs})`,
	);
	const downloadProcess = spawnSync(config.cmd, config.cdmArgs, {shell: true});
	console.log("Download finished",
		`\nSTDERR: ${downloadProcess.stderr}`,
		`\nSTDOUT: ${downloadProcess.stdout}`);
	return downloadProcess;
}

export async function zipDataset(config: FetchDatasetConfig, path: string) {
	const tmpDir = tmpDirForDatasetFetching(config);
	const datasetName = assertValue(path.split("/").at(-1));
	console.log(
		"Zipping dataset",
		datasetName,
		"to",
		`${tmpDir}/${datasetName}.zip`,
	);
	const outputFile = createWriteStream(`${tmpDir}/${datasetName}.zip`);
	createReadStream
	const archive = archiver("zip", { zlib: { level: 9 } });

	// add some listeners
	outputFile.on("close", () => {
		console.log(
			`${datasetName} resulted in ${Math.floor(
				archive.pointer() / 1024 / 1024,
			)} MB`,
		);
		console.log("archiver finalized");
	});
	// good practice to catch warnings (ie stat failures and other non-blocking errors)
	archive.on("warning", (err) => {
		if (err.code === "ENOENT") {
			console.log(err);
		} else {
			throw err;
		}
	});
	// good practice to catch this error explicitly
	archive.on("error", (err) => {
		throw err;
	});

	archive.pipe(outputFile);
	archive.directory(`${tmpDir}/${path}`, `${datasetName}`);
	await archive.finalize();
	return datasetName;
}

export async function uploadDatasetToSupabase(
	config: FetchDatasetConfig,
	datasetName: string,
) {
	console.log("Creating bucket");
	const bucket = await supabaseServiceClient.storage.createBucket("datasets", {
		public: true,
	});
	console.log("Bucket:", bucket);

	console.log(
		"Reading zip file into ReadStream:",
		`${assertValue(tmpDirForDatasetFetching(config))}/${datasetName}.zip`,
	);
	const content = createReadStream(
		`${assertValue(tmpDirForDatasetFetching(config))}/${datasetName}.zip`,
	);

	console.log("Uploading to supabase bucket");
	await supabaseServiceClient.storage
		.from("datasets")
		.upload(`${config.fetchId}/${datasetName}.zip`, content,  {duplex: "half"});
}

export function cleanUp(config: FetchDatasetConfig) {
	rmdirSync(tmpDirForDatasetFetching(config));
}

function tmpDirForDatasetFetching(config: FetchDatasetConfig) {
	return `${assertValue(process.env.ROOT_DIR)}/tmp/${config.fetchId}`;
}
