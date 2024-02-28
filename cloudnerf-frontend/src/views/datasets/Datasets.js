import { Row, Col, Button, List } from "antd";

import { useGetDatasetsQuery, useDeleteDatasetMutation } from "../../redux/api";

function Datasets() {
	const { data } = useGetDatasetsQuery();
	const [deleteDataset] = useDeleteDatasetMutation();

	console.log(data);

	return (
		<>
			<Row>
				<Col span={12}>
					<h1>Datasets</h1>
				</Col>
				<Col
					span={12}
					style={{
						display: "flex",
						textAlign: "right",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<Button type="primary" href="/datasets/fetch">
						Fetch existing Datasets
					</Button>
					<Button type="primary" href="/datasets/new">
						New Dataset
					</Button>
				</Col>
			</Row>

			<Row>
				<Col span={24}>
					<List
						bordered
						dataSource={data}
						renderItem={(item, index) => (
							<List.Item
								actions={[
									<a href={`/datasets/${item.name}`}>View</a>,
									// <Button type="primary" href={`/datasets/${item.id}/edit`}>Edit</Button>,
									<Button onClick={() => deleteDataset(item.name)}>
										Delete
									</Button>,
								]}
							>
								<List.Item.Meta
									title={
										<>
											{item.name}{" "}
											<span
												style={{ color: "gray", fontWeight: "lighter", fontSize: 12 }}
											>
												{item.images} images
											</span>
										</>
									} // {`${item.name} -  Images: ${item.images}`}
									description={`${item.description} - Dataset type: ${item.datasetType}`}
								/>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</>
	);
}

export default Datasets;
