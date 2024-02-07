//native
import { mkdirSync, readFileSync, unlink } from "fs";
//3rdparty
import express from "express";
import cors from "cors";
import multer from "multer";
import { config } from "dotenv";
//own
import { supabase } from "./supabase.js";
import {
	downloadDataset,
	uploadDatasetsToSupabase,
} from "./fetch_datasets/utils.js";
import { fetchDatasetConfigs } from "./fetch_datasets/configs.js";
import {
	loadDatasetIntoTemporaryDirectory,
	runModel,
} from "./run_models/utils.js";
import { runModelsConfigs } from "./run_models/configs.js";

config({ debug: true });

const app = express();
const port = 5000;

app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.get("/datasets", (req, res) => {
	supabase.storage
		.from("datasets")
		.list()
		.then(({ data, error }) => {
			if (error) {
				console.log("error", error);
				res.status(500).send("error");
			}
			console.log("datasets", data);
			res.send(data);
		})
		.catch((error) => {
			console.log("error", error);
			res.status(500).send("error");
		});
});

app.get("/datasets/:id", (req, res) => {
	const { id } = req.params;
	supabase.storage
		.from("datasets")
		.list(id)
		.then(({ data, error }) => {
			if (error) {
				console.log("error", error);
				res.status(500).send("error");
			}
			console.log("datasets", data);
			res.send(data);
		})
		.catch((error) => {
			console.log("error", error);
			res.status(500).send("error");
		});
});

app.get("/datasets/:id/images", (req, res) => {
	const { id } = req.params;
	const filelocation = `${id}/images`;
	supabase.storage
		.from("datasets")
		.list(filelocation)
		.then(({ data, error }) => {
			if (error) {
				console.log("error", error);
				res.status(500).send("error");
			}
			console.log("datasets", data);
			res.send(data);
		})
		.catch((error) => {
			console.log("error", error);
			res.status(500).send("error");
		});
});

app.post(
	"/datasets/:id/images",
	upload.array("file", 400),
	(req, res, next) => {
		const { id } = req.params;
		console.log("id", id);

		console.log("files", req.files);

		// now upload to supabase
		const filelocation = `${id}/images/${req.files[0].originalname}`;

		console.log("filelocation", filelocation);
		const fileContent = readFileSync(req.files[0].path);

		supabase.storage
			.from("datasets")
			.upload(filelocation, fileContent, { contentType: req.files[0].mimetype })
			.then(({ data, error }) => {
				if (error) {
					console.log("error", error);
					res.status(500).send("error");
				}
				console.log("datasets", data);
				res.send(data);

				// Clean up uploaded file from the server
				unlink(req.files[0].path, (err) => {
					if (err) {
						console.error("Error cleaning up file:", err);
					} else {
						console.log("File deleted successfully:", req.files[0].path);
					}
				});
			})
			.catch((error) => {
				console.log("error", error);
				res.status(500).send("error");
			});
	},
);

app.post(
	"/datasets/:id/transforms",
	upload.array("file", 400),
	(req, res, next) => {
		const { id } = req.params;

		console.log("files", req.files);

		// now upload to supabase
		const filelocation = `${id}/${req.files[0].originalname}`;

		console.log("filelocation", filelocation);
		const fileContent = readFileSync(req.files[0].path);

		supabase.storage
			.from("datasets")
			.upload(filelocation, fileContent, { contentType: req.files[0].mimetype })
			.then(({ data, error }) => {
				if (error) {
					console.log("error", error);
					res.status(500).send("error");
				}
				console.log("datasets", data);
				res.send(data);

				// Clean up uploaded file from the server
				unlink(req.files[0].path, (err) => {
					if (err) {
						console.error("Error cleaning up file:", err);
					} else {
						console.log("File deleted successfully:", req.files[0].path);
					}
				});
			})
			.catch((error) => {
				console.log("error", error);
				res.status(500).send("error");
			});
	},
);

app.get("/datasets/fetch/:id", async (req, res) => {
	const { id: fetchId } = req.params;
	const config = fetchDatasetConfigs.filter((c) => c.fetchId === fetchId)[0];
	downloadDataset(config);
	await uploadDatasetsToSupabase(config);
	res.status(200).send("success");
});

app.get("/run_model/:modelId/:datasetId", async (req, res) => {
	const { modelId, datasetId } = req.params;
	const config = runModelsConfigs.filter((c) => c.modelId === modelId)[0];
	await loadDatasetIntoTemporaryDirectory(modelId, datasetId);
	runModel(config);
	res.status(200).send("success)");
});
