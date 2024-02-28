import React, { useEffect } from "react";
import { Row, Col, List } from "antd";

import { useParams } from "react-router-dom";
import { useGetDatasetImagesQuery } from "../../redux/api";

function Datasets() {
	const { id } = useParams();

	const { data: images } = useGetDatasetImagesQuery(id);

	useEffect(() => {
		console.log("dataset id", id);
	}, [id]);

	return (
		<>
			<Row>
				<Col span={24}>
					<h1>Edit Dataset: {id}</h1>
				</Col>
			</Row>

			<Row>
				<h3>Images</h3>
				<div
					id="scrollableDiv"
					style={{
						height: 400,
						overflow: "auto",
						padding: "0 16px",
						border: "1px solid rgba(140, 140, 140, 0.35)",
						borderRadius: "4px",
						width: "100%",
					}}
				>
					<List
						itemLayout="horizontal"
						size="small"
						dataSource={images}
						renderItem={(item) => <List.Item>{item.name}</List.Item>}
					/>
				</div>
			</Row>
		</>
	);
}

export default Datasets;
