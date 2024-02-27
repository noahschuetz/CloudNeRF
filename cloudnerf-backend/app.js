//3rdparty
import express from "express";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import { config } from "dotenv";

//own
import {
	downloadDataset,
	uploadDatasetsToSupabase,
} from "./fetch_datasets/utils.js";
import { fetchDatasetConfigs } from "./fetch_datasets/configs.js";
import {
	installModel,
	loadDatasetIntoTemporaryDirectory,
	runModel,
	exportModel,
} from "./run_models/utils.js";
import { runModelsConfigs } from "./run_models/configs.js";
import { spawnSync } from "child_process";
import { log } from "console";
import {
	deleteDatasetById,
	getDatasetById,
	getDatasetsInfo,
	getImagesOfDataset,
	patchImagesOfDataset,
	postDataset,
	postImagesToDataset,
	postTransformsOfDataset,
} from "./datasets/utils.js";
import { getMeshUrlOfResult, getResults, postResult } from "./results/utils.js";

config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("short"));

const upload = multer({ dest: "uploads/" });

app.listen(port, "0.0.0.0", () => {
	console.log(`CloudNeRF API listening on port ${port}`);
});

app.get("/", (req, res) => {
	res.send("The API server is up and running!");
});

// DATASETS

app.get("/datasets", async (req, res) => {
	/**
	 * Endpoint to retrieve information about existing datasets
	 */
	const allInfo = await getDatasetsInfo();
	res.json(allInfo);
});

app.post("/datasets/", async (req, res) => {
	/**
	 * Endpoint to upload dataset information
	 */
	await postDataset(req, res);
});

app.get("/datasets/:id", (req, res) => {
	/**
	 * Endpoint to retrieve a specific dataset by its id
	 */
	getDatasetById(req, res);
});

app.delete("/datasets/:id", async (req, res) => {
	/**
	 * Endpoint to delete a dataset by its id
	 */
	await deleteDatasetById(req, res);
});

app.get("/datasets/:id/images", (req, res) => {
	/**
	 * Endpoint to retrieve the images to the corresponsding dataset
	 */
	getImagesOfDataset(req, res);
});

/** Endpoint to upload images of a dataset */
app.post(
	"/datasets/:id/images",
	upload.array("file", 1000),
	async (req, res) => {
		await postImagesToDataset(req, res);
	},
);

/** Endpoint to modify images of a dataset */
app.patch("/datasets/:id/images", async (req, res) => {
	await patchImagesOfDataset(req, res);
});

/** Endpoint to upload the transforms file of a dataset */
app.post(
	"/datasets/:id/transforms",
	upload.array("file", 400),
	(req, res, next) => {
		postTransformsOfDataset(req, res);
	},
);

// FETCH DATASETS

/** Endpoint to retrieve information about datasets that can
 * be downloaded via the UI */
app.get("/datasets/fetch/configs", async (req, res) => {
	res.json(fetchDatasetConfigs);
});

/** Endpoint to trigger the download of a dataset */
app.get("/datasets/fetch/:id", async (req, res) => {
	const { id: fetchId } = req.params;
	const config = fetchDatasetConfigs.filter((c) => c.fetchId === fetchId)[0];
	downloadDataset(config).once("close", async () => {
		await uploadDatasetsToSupabase(config);
		res.status(200).send("success");
	});
});

// MODELS

/** Endpoint to trigger the run/training process of a model
 * on a specific dataset
 */
app.get("/models/run/:modelId/:datasetId", async (req, res) => {
	const { modelId, datasetId } = req.params;
	const config = runModelsConfigs.filter((c) => c.modelId === modelId)[0];
	await loadDatasetIntoTemporaryDirectory(modelId, datasetId);

	const trainingProcess = runModel(config, datasetId);

	trainingProcess.once("close", () => {
		exportModel(config, datasetId);
	});
	res.status(200).send("success");
});

/** Endpoint to retrieve information about docker images
 * pulled on the system. Used to verify which models are
 * "installed"
 */
app.get("/models/docker_images", async (req, res) => {
	const dockerImagesInfoJson = spawnSync("docker", [
		"images",
		"--format",
		"json",
	]);
	console.error({
		stdout: dockerImagesInfoJson.stdout,
		stderr: dockerImagesInfoJson.stderr,
		output: dockerImagesInfoJson.output,
		status: dockerImagesInfoJson.status,
		error: dockerImagesInfoJson.error,
	});
	if (dockerImagesInfoJson.error) {
		console.error("Failed to retrieve docker images! Returning empty list.");
		res.json([]);
		return;
	}
	const dockerImagesInfo = JSON.parse(
		`[${dockerImagesInfoJson.stdout.split("\n").slice(0, -1).join(",")}]`,
	);
	const dockerImages = dockerImagesInfo.map((di) => di.Repository);
	res.json(dockerImages);
});

/** Endpoint to retrieve information about models available
 * in the UI
 */
app.get("/models/configs", async (req, res) => {
	res.json(runModelsConfigs);
});

/**
 * Endpoint to trigger the "installation" of a model. This
 * essentially boils down to pulling/building the docker image
 * that supports running the respective model
 */
app.get("/models/install/:modelId", async (req, res) => {
	const { modelId } = req.params;
	const config = runModelsConfigs.filter((c) => c.modelId === modelId)[0];
	installModel(config).once("close", () => res.status(200).send("success"));
});

/** Endpoint to retrieve meshes that are stored in supabase */
app.get("/results", async (req, res) => {
	await getResults(req, res);
});

/** Endpoint to generate the url of the mesh so that the user
 * can download it
 */
app.get("/results/:id/meshUrl", async (req, res) => {
	await getMeshUrlOfResult(req, res);
});

/**
 * Endpoint to add new results to the database via the UI
 */
app.post("/results/", async (req, res) => {
	await postResult(req, res);
});
