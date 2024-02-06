import { nanoid } from "nanoid";
import { fetchDatasetConfigs } from "../fetch_datasets/configs";
import { FetchDatasetButton } from "../components/FetchDatasetButton";

export default async function DatabasesPage() {
	return (
		<main>
			{fetchDatasetConfigs.map((config) => (
				<FetchDatasetButton fetchId={config.fetchId} key={nanoid()} />
			))}
		</main>
	);
}
