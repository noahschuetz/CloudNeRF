import { Button, Spin, Row, Col, List, Select } from "antd";
import {
	useGetDatasetsQuery,
	useGetDockerImagesQuery,
	useGetRunModelConfigsQuery,
} from "../../redux/api";
import { useEffect, useState } from "react";

export default function Models() {
	const { data } = useGetDatasetsQuery();
	const { data: dockerImages } = useGetDockerImagesQuery();
	const [selectedDataset, setSelectedDataset] = useState(undefined);
	const [selectedModel, setSelectedModel] = useState(undefined);

	const { data: modelConfigs } = useGetRunModelConfigsQuery();

	const models = modelConfigs.map((mc) => ({
		...mc,
		name: mc.modelId,
		label: mc.displayName,
		value: mc.modelId,
		description: mc.displayName,
	}));

	const handleRunModel = async () => {
		const res = await fetch(
			`http://localhost:5000/models/run/${selectedModel}/${selectedDataset}`,
		);
		console.log(res);
	};

	return (
		<>
			<Row>
				<Col span={24}>
					<h1>Models</h1>

					<List
						bordered
						dataSource={models}
						renderItem={(item, index) => (
							<List.Item
								actions={[
									dockerImages ? (dockerImages.include(item.dockerImage) ? (
										<p>already installed, cool</p>
									) : (
										<Button>Install</Button>
									)) : <Spin />,
									// <RunModelButton modelId={item.name} datasetId={datasetId} />
								]}
							>
								<List.Item.Meta
									title={item.name}
									description={item.description}
								/>
							</List.Item>
						)}
					/>
				</Col>
			</Row>

			<Row>
				<Col span={24}>
					<h1>Run Models</h1>
					Dataset:
					<Select
						placeholder="Select a dataset"
						style={{ width: 120, marginLeft: 10, marginRight: 10 }}
						onChange={(value) => setSelectedDataset(value)}
						options={data}
					/>
					Model:
					<Select
						placeholder="Select a model"
						style={{ width: 120, marginLeft: 10, marginRight: 10 }}
						onChange={(value) => setSelectedModel(value)}
						options={models}
					/>
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
		</>
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
