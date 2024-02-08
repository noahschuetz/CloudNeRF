import { Button, Spin } from "antd";
import { useGetDatasetsQuery } from "../../redux/api";
import { useState } from "react";

export default function Models() {
	const { data } = useGetDatasetsQuery();

	const [datasetId, setDatasetId] = useState(undefined);

	console.log(data);

	return (
		<main style={{ display: "flex" }}>
			<div style={{ flex: 1 }}>
				<RunModelButton modelId="instantngp" datasetId={datasetId}>
					Instant-NGP
				</RunModelButton>
				<RunModelButton modelId="nerfacto" datasetId={datasetId}>
					Nerfacto
				</RunModelButton>
				<RunModelButton modelId="neus" datasetId={datasetId}>
					Neus
				</RunModelButton>
			</div>
			<div style={{ flex: 1 }}>
				Selected dataset: {datasetId}
				{data ? (
					data.map((d) => (
						<PickDatasetButton
							datasetId={d.name}
							selectedDatasetId={datasetId}
							callback={(datasetId) => setDatasetId(datasetId)}
						/>
					))
				) : (
					<Spin />
				)}
			</div>
		</main>
	);
}

function RunModelButton({ modelId, datasetId, children }) {
	return (
		<Button
			style={{ display: "block" }}
			onClick={async () => {
				const res = await fetch(
					`http://localhost:5000/run_model/${modelId}/${datasetId}`,
				);
				console.log(res);
			}}
			disabled={datasetId === undefined}
		>
			Run {children}
		</Button>
	);
}

function PickDatasetButton({ datasetId, selectedDatasetId, callback }) {
	return (
		<Button style={{ display: "block" }} onClick={() => callback(datasetId)}>
			Pick {datasetId}
		</Button>
	);
}
