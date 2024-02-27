import { Button, Spin, Row, Col, List, Select } from "antd";
import {
	useGetDatasetsQuery,
	useGetDockerImagesQuery,
	useGetRunModelConfigsQuery,
} from "../../redux/api";
import { useEffect, useState } from "react";

export default function Models() {
	const { data: datasets } = useGetDatasetsQuery();
	const { data: dockerImages, error } = useGetDockerImagesQuery();
	const [selectedDataset, setSelectedDataset] = useState(undefined);
	const [selectedModel, setSelectedModel] = useState(undefined);
	const { data: modelConfigs } = useGetRunModelConfigsQuery();

	const models = modelConfigs?.map((mc) => ({
		...mc,
		name: mc.modelId,
		label: mc.displayName,
		value: mc.modelId,
		description: mc.displayName,
	}));

	const handleRunModel = async () => {
		const res = await fetch(
			`${process.env.REACT_APP_API_ENDPOINT_URL}/models/run/${selectedModel}/${selectedDataset}`,
		);
	};

	return (
		<>
			<Row>
				<Col span={24}>
					<h1>Run Models</h1>
					Dataset:
					<Select
						placeholder="Select a dataset"
						style={{ width: 120, marginLeft: 10, marginRight: 10 }}
						onChange={(value) => setSelectedDataset(value)}
						options={datasets}
					/>
					Model:{" "}
					{dockerImages ? (
						<Select
							placeholder="Select a model"
							style={{ width: 120, marginLeft: 10, marginRight: 10 }}
							onChange={(value) => setSelectedModel(value)}
							options={models?.filter((mc) =>
								dockerImages.includes(mc.dockerImage),
							)}
						/>
					) : (
						<Spin />
					)}
					<Button
						style={{ width: 120, marginLeft: 10 }}
						type="primary"
						onClick={() => handleRunModel()}
						disabled={
							selectedDataset === undefined || selectedModel === undefined
						}
					>
						Run
					</Button>
					{/* <div>
				<RunModelButton modelId="instantngp" datasetId={datasetId}>
					Instant-NGP
				</RunModelButton>
				<RunModelButton modelId="nerfacto" datasetId={datasetId}>
					Nerfacto
				</RunModelButton>
				<RunModelButton modelId="neus" datasetId={datasetId}>
					Neus
				</RunModelButton>
			</div> */}
					{/* <div style={{ flex: 1 }}>
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
			</div> */}
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<h1>Models</h1>
					{modelConfigs && dockerImages ? (
						<List
							bordered
							dataSource={models}
							renderItem={(item, index) => (
								<ModelListItem
									item={item}
									installedInitally={dockerImages.includes(item.dockerImage)}
								/>
							)}
						/>
					) : (
						<Spin />
					)}
				</Col>
			</Row>
		</>
	);
}

function ModelListItem({ item, installedInitally }) {
	const [installed, setInstalled] = useState(installedInitally);
	const [installing, setInstalling] = useState(false);

	return (
		<List.Item
			actions={[
				installing ? (
					<Spin />
				) : (
					<Button
						onClick={async () => {
							setInstalling(true);
							const res = await fetch(
								`${process.env.REACT_APP_API_ENDPOINT_URL}/models/install/${item.modelId}`,
							);
							if (res.status === 200) {
								setInstalled(true);
								setInstalling(false);
							}
						}}
						disabled={installed}
					>
						{installed ? "Installed" : "Install"}
					</Button>
				),
				// <RunModelButton modelId={item.name} datasetId={datasetId} />
			]}
		>
			<List.Item.Meta title={item.name} description={item.description} />
		</List.Item>
	);
}

function RunModelButton({ modelId, datasetId, children }) {
	return (
		<Button
			style={{ display: "block" }}
			onClick={async () => {
				const res = await fetch(
					`process.env.REACT_APP_API_ENDPOINT_URL/run_model/${modelId}/${datasetId}`,
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
