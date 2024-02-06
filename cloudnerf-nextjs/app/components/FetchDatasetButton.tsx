"use client";

import { fetchDataset } from "../actions/fetch_datasets";

export function FetchDatasetButton({ fetchId }: { fetchId: string }) {
	return (
		<button type="button" onClick={() => fetchDataset(fetchId)}>
			Download datasets from the '{fetchId}' database
		</button>
	);
}
