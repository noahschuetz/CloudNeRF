export async function getDatasetsInfo() {
	const { data, error } = await supabase.storage.from("datasets").list();

	if (error) {
		console.log("error", error);
		res.status(500).send("error");
	}

	const allInfo = [];

	for (const dataset of data) {
		try {
			const { data: fileInfo, error: fileError } = await supabase.storage
				.from("datasets")
				.download(`${dataset.name}/info.json`);

			if (fileError) {
				console.error(
					`Error downloading info.json from folder ${folder.name}:`,
					fileError,
				);
				continue;
			}

			// Convert Blob to string
			const fileInfoText = await fileInfo.text();

			// Parse the JSON data
			const infoData = JSON.parse(fileInfoText);

			// Push info data into the array
			allInfo.push(infoData);
		} catch (error) {
			console.error("Error downloading info from folders:", error.message);
			console.error("Erronous dataset is", dataset.name);
		}
	}

	return allInfo;
}

export async function postDataset(req, res) {
	console.log("req.body", req.body);
	const { name, description, compatible_models, images } = req.body;
	const { data, error } = await supabase.storage
		.from("datasets")
		.upload(`${name}/info.json`, JSON.stringify(req.body), {
			contentType: "application/json",
		});
	if (error) {
		console.log("error", error);
		res.status(500).send("error");
	}
	console.log("datasets", data);
	res.send(data);
}

export function getDatasetById(req, res) {
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
}

export async function deleteDatasetById(req, res) {
	try {
		const { id } = req.params;

		const { data: images, error: imagesError } = await supabase.storage
			.from("datasets")
			.list(`${id}/images`, { limit: 10000 });

		if (imagesError) {
			console.log("error", imagesError);
			res.status(500).send("error");
		}

		console.log("images", images);

		// delete images
		for (const image of images) {
			const { data, error } = await supabase.storage
				.from("datasets")
				.remove(`${id}/images/${image.name}`);
			if (error) {
				console.log("error", error);
				res.status(500).send("error");
			}
			console.log("datasets", data);
		}

		// delete info.json
		const { data, error } = await supabase.storage
			.from("datasets")
			.remove([`${id}/info.json`]);
		if (error) {
			console.log("error", error);
			res.status(500).send("error");
		}

		// delete transforms.json
		const { data: transforms, error: transformsError } = await supabase.storage
			.from("datasets")
			.remove([`${id}/transforms.json`]);
		if (transformsError) {
			console.log("error", transformsError);
			res.status(500).send("error");
		}

		res.send("datasets deleted successfully");
	} catch (error) {
		console.error("Error deleting dataset:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export function getImagesOfDataset(req, res) {
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
}

export async function postImagesToDataset(req, res) {
	const { id } = req.params;
	console.log("id", id);
	console.log("files", req.files);

	// now upload to supabase
	const filelocation = `${id}/images/${req.files[0].originalname}`;

	console.log("filelocation", filelocation);
	const fileContent = readFileSync(req.files[0].path);

	try {
		const { data, error } = await supabase.storage
			.from("datasets")
			.upload(filelocation, fileContent, {
				contentType: req.files[0].mimetype,
			});

		if (error) {
			console.log("error", error);
			res.status(500).send("error");
		}
		console.log("datasets", data);

		// // get how many images are in the folder
		// const filelocationImages = `${id}/images`;
		// const { data: images, error: imagesError } = await supabase.storage
		// 	.from("datasets")
		// 	.list(filelocationImages);

		// if (imagesError) {
		// 	console.log("error", imagesError);
		// 	res.status(500).send("error");
		// }
		// console.log("images", images);

		// // update the info.json file with the new about of images
		// const { data: fileInfo, error: fileError } = await supabase.storage.from('datasets').download(`${id}/info.json`);

		// if (fileError) {
		// 	console.error(`Error downloading info.json from folder ${id}:`, fileError);
		// }

		// // Convert Blob to string
		// const fileInfoText = await fileInfo.text();

		// // Parse the JSON data
		// const infoData = JSON.parse(fileInfoText);

		// // Update the images count
		// infoData.images = images.length;

		// // Update the updated info.json file
		// const { data: updatedInfo, error: updatedInfoError } = supabase.storage
		// 	.from("datasets")
		// 	.update(`${id}/info.json`, JSON.stringify(infoData), {
		// 		contentType: "application/json",
		// 	});

		// if (updatedInfoError) {
		// 	console.log("error", updatedInfoError);
		// 	res.status(500).send("error");
		// }

		res.send(data);

		// Clean up uploaded file from the server
		unlink(req.files[0].path, (err) => {
			if (err) {
				console.error("Error cleaning up file:", err);
			} else {
				console.log("File deleted successfully:", req.files[0].path);
			}
		});
	} catch (error) {
		console.log("error", error);
		res.status(500).send("error");
	}
}

export async function patchImagesOfDataset(req, res) {
	const { id } = req.params;
	const { data: images, error: imagesError } = await supabase.storage
		.from("datasets")
		.list(`${id}/images`);

	if (imagesError) {
		console.log("error", imagesError);
		res.status(500).send("error");
	}
	console.log("images", images);

	// update the info.json file with the new about of images
	const { data: fileInfo, error: fileError } = await supabase.storage
		.from("datasets")
		.download(`${id}/info.json`);

	if (fileError) {
		console.error(`Error downloading info.json from folder ${id}:`, fileError);
	}

	// Convert Blob to string
	const fileInfoText = await fileInfo.text();

	// Parse the JSON data
	const infoData = JSON.parse(fileInfoText);

	// Update the images count
	infoData.images = images.length;

	// Update the updated info.json file
	const { data: updatedInfo, error: updatedInfoError } = supabase.storage
		.from("datasets")
		.update(`${id}/info.json`, JSON.stringify(infoData), {
			contentType: "application/json",
		});

	if (updatedInfoError) {
		console.log("error", updatedInfoError);
		res.status(500).send("error");
	}

	res.send(updatedInfo);
}

export function postTransformsOfDataset(req, res) {
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
}
