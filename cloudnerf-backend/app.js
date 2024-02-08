//native
import { readFileSync, unlink } from "fs";
//3rdparty
import express from "express";
import cors from "cors";
import multer from "multer";
import { config } from "dotenv";
//own
import { supabase } from "./supabaseClient.js";
import {
	downloadDataset,
	uploadDatasetsToSupabase,
} from "./fetch_datasets/utils.js";
import { fetchDatasetConfigs } from "./fetch_datasets/configs.js";
import { info } from "console";

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

app.get("/datasets", async (req, res) => {

	try {
		const { data, error } = await supabase.storage.from("datasets").list()
		console.log("data", data);

		if (error) {
			console.log("error", error);
			res.status(500).send("error");
		}

		const allInfo = [];

		for (const dataset of data) {
			console.log("dataset.name", dataset.name);
			const { data: fileInfo, error: fileError } = await supabase.storage.from('datasets').download(`${dataset.name}/info.json`);

			if (fileError) {
				console.error(`Error downloading info.json from folder ${folder.name}:`, fileError);
				continue;
			}

			// Convert Blob to string
			const fileInfoText = await fileInfo.text();

			// Parse the JSON data
			const infoData = JSON.parse(fileInfoText);

			// Push info data into the array
			allInfo.push(infoData);

		}

		// Send the combined info data as a response
		res.json(allInfo);

	} catch (error) {
		console.error('Error downloading info from folders:', error.message);
    	res.status(500).json({ error: 'Internal server error' });
  	}
});

// parameter are name, description, compatible_models, images
app.post("/datasets/", async (req, res) => {
	console.log("req.params", req.params);
	console.log("req.body", req.body);
	// const { name, description, compatible_models, images } = req.body;
	// const { data, error } = await supabase.storage
	// 	.from("datasets")
	// 	.upload(`${name}/info.json`, JSON.stringify(req.body), {
	// 		contentType: "application/json",
	// 	});
	// if (error) {
	// 	console.log("error", error);
	// 	res.status(500).send("error");
	// }
	// console.log("datasets", data);
	// res.send(data);
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
	console.log({ config });
	downloadDataset(config);
	uploadDatasetsToSupabase(config);
});
