"use server";
import { assertValue } from "@/utils";
import { fetchDatasetConfigs } from "../fetch_datasets/configs";
import {
	downloadDataset,
	uploadDatasetToSupabase,
	zipDataset,
} from "../fetch_datasets/utils";

export async function fetchDataset(fetchId: string) {
	const config = fetchDatasetConfigs.filter((c) => c.fetchId === fetchId)[0];
	assertValue(config);

	// downloadDataset(config);

	for (const path of config.datasetPaths) {
		const datasetName = await zipDataset(config, path);
		await uploadDatasetToSupabase(config, datasetName);
		console.log("Uploaded dataset")
		break;
	}
}
