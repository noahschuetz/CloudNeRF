import { Row, Col, Button, List, Spin } from "antd";
import { useState } from "react";
import {
	useGetFetchDatasetConfigsQuery,
	useGetDatasetsQuery,
} from "../../redux/api";

export default function FetchDatasets() {
	const { data: datasets } = useGetDatasetsQuery();
	const { data: fetchDatasetsConfigs } = useGetFetchDatasetConfigsQuery();
	const downloadedDatasetBundles = datasets?.map((d) => d.dataset_bundle);

	console.log(downloadedDatasetBundles);
	console.log(fetchDatasetsConfigs);

	return (
		<>
			<Row>
				<Col span={24}>
					<h1>Fetch Dataset Bundles</h1>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<List
						bordered
						dataSource={fetchDatasetsConfigs}
						renderItem={(item, index) => (
							<FetchDatasetListItem
								item={item}
								disableDownload={downloadedDatasetBundles?.includes(
									item.fetchId,
								)}
							/>
						)}
					/>
				</Col>
			</Row>
		</>
	);
}

function FetchDatasetListItem({ item, disableDownload }) {
	const [downloading, setDownloading] = useState(false);
	return (
		<List.Item
			actions={[
				disableDownload ? (
					<p>already downloaded, cool</p>
				) : downloading ? (
					<Spin />
				) : (
					<Button
						onClick={async () => {
							setDownloading(true);
							const res = await fetch(`http://localhost:5000/datasets/fetch/${item.fetchId}`);
							if (res.status === 200){
								disableDownload = true
								setDownloading(false)
							}
						}}
					>
						Download
					</Button>
				),
				// <RunModelButton modelId={item.name} datasetId={datasetId} />
			]}
		>
			<List.Item.Meta
				title={item.fetchId}
				description={`Contains following datasets: ${item.datasetPaths
					.map((dp) => dp[0])
					.join(", ")}`}
			/>
		</List.Item>
	);
}
