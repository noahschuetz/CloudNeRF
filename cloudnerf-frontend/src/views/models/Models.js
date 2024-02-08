import { Button, Spin, Row, Col, List, Select } from "antd";
import { useGetDatasetsQuery } from "../../redux/api";
import { useEffect, useState } from "react";

export default function Models() {
	const { data } = useGetDatasetsQuery();
	const [selectedDataset, setSelectedDataset] = useState(undefined);
	const [selectedModel, setSelectedModel] = useState(undefined);

	const models = [
		{
			name: "instantngp",
			label: "Instant-NGP",
			value: "instantngp",
			description: "Instant-NGP",
		},
		{
			name: "nerfacto",
			label: "Nerfacto",
			value: "nerfacto",
			description: "Nerfacto",
		},
		{
			name: "neus",
			label: "Neus",
			value: "neus",
			description: "Neus",
		},
	];

	const handleRunModel = async () => {
		const res = await fetch(
			`http://localhost:5000/run_model/${selectedModel}/${selectedDataset}`,
		);
		console.log(res);
	};

	return (
		<>
			<Row>
				<Col span={24}>
					<h1>Models</h1>

					<List bordered dataSource={models} renderItem={(item, index) => (
						<List.Item
							actions={[
								<Button>Install</Button>,
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
						style={{ width: 120, marginLeft: 10, marginRight: 10}} 
						onChange={(value) => setSelectedDataset(value)}
						options={data}
					/>

					Model: 
					<Select
						placeholder="Select a model"
						style={{ width: 120, marginLeft: 10, marginRight: 10}}
						onChange={(value) => setSelectedModel(value)}
						options={models}
					/>

					<Button 
						style={{ width: 120, marginLeft: 10}}
						type="primary" 
						onClick={() => console.log("Run model")}
						disabled={selectedDataset === undefined || selectedModel === undefined}
					>Run</Button>
					

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
