import { Row, Col, Button } from "antd";
import { useState } from "react";

export default function FetchDatasets() {
	return (
		<>
			<Row>
				<Col span={24}>
					<h1>Fetch Datasets</h1>
				</Col>
			</Row>
			<Row>
				<Col>
					<FetchButton id={"blender"} />
					<FetchButton id={"nerfstudio"} />
				</Col>
			</Row>
		</>
	);
}

function FetchButton({ id }) {
	const [downloadState, setDownloadState] = useState("not downloaded");

	return (
		<Button
			onClick={async () => {
				setDownloadState("downloading...");
				const res = await fetch(`http://localhost:5000/datasets/fetch/${id}`);
				res.status === 200
					? setDownloadState("successfully downloaded")
					: setDownloadState("error while downloading, check logs");
			}}
		>
			Download {id} datasets | {downloadState}
		</Button>
	);
}
