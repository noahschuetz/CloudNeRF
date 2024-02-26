export async function getResults(req, res) {
	const { data, error } = await supabase.storage.from("results").list();

	if (error) {
		console.log("error", error);
		res.status(500).send("error");
	}

	//get info.json from each folder
	const allInfo = [];

	for (const folder of data) {
		const { data: fileInfo, error: fileError } = await supabase.storage
			.from("results")
			.download(`${folder.name}/info.json`);

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
	}

	// Send the combined info data as a response
	res.json(allInfo);
}

export async function getMeshUrlOfResult(req, res) {
	const { id } = req.params;
	log("id", id);

	const { data: resultlist, resultlisterror } = await supabase.storage
		.from("results")
		.list(`${id}/mesh`);

	if (resultlisterror) {
		// console.log("error", resultlisterror);
		res.status(500).send("error");
	}

	const filename = resultlist[0].name;
	// log("filename", filename);

	const pathtofile = `/${id}/mesh/${filename}`;
	log("pathtofile", pathtofile);

	// const { data, error } = await supabase.storage.from("results").createSignedUrl('/test_name/mesh/placeholder.fbx', 60)
	const { data, error } = await supabase.storage
		.from("results")
		.createSignedUrl(pathtofile, 600);

	if (error) {
		// console.log("error", error);
		res.status(500).send("error");
	}
	console.log("results", data);

	res.send(data);
}

export async function postResult(req, res) {
	const { name } = req.body;
	const { data, error } = await supabase.storage
		.from("results")
		.upload(`${name}/info.json`, JSON.stringify(req.body), {
			contentType: "application/json",
		});
	if (error) {
		console.log("error", error);
		res.status(500).send("error");
	}

	console.log("results", data);
	res.send(data);
}
