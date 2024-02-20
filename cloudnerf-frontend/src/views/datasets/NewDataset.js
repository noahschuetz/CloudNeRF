import React, { useState } from "react";
import { Row, Col, Button, Input, message, Upload, Steps } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import { useCreateDatasetMutation, useUpdateImagesMutation } from "../../redux/api";

const { Dragger } = Upload;


const steps = [
	{
		title: "Name",
	},
	{
		title: "Upload Images or Video",
	},
	{
		title: "Upload transform.json",
	},
];

function Datasets() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [compatible_models, setCompatibleModels] = useState([]);
	const [images, setImages] = useState(0);

	const [createDataset] = useCreateDatasetMutation();
	const [updateImages] = useUpdateImagesMutation();

	const props = {
		name: "file",
		multiple: true,
		// on localhost the backend is running on port 5000
		action: `http://localhost:5000/datasets/${name}/images`,
		onChange(info) {
			const { status } = info.file;
			if (status !== "uploading") {
				console.log(info.file, info.fileList);
			}
			if (status === "done") {
				message.success(`${info.file.name} file uploaded successfully.`);
			} else if (status === "error") {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};

	const props2 = {
		name: "file",
		multiple: true,
		// on localhost the backend is running on port 5000
		action: `http://localhost:5000/datasets/${name}/transforms`,
		onChange(info) {
			const { status } = info.file;
			if (status !== "uploading") {
				console.log(info.file, info.fileList);
			}
			if (status === "done") {
				message.success(`${info.file.name} file uploaded successfully.`);
			} else if (status === "error") {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};

	const [current, setCurrent] = useState(0);
	const next = () => {
		setCurrent(current + 1);
	};
	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));

	const handleCreateDataset = async () => {
		const dataset = {
			name: name,
			description: description,
			datasetType: "instant-ngp-data",
			images: images,
		};
		const { data, error } = await createDataset(dataset);
		if (error) {
			console.log("error", error);
			message.error("Error creating dataset");
		} else {
			console.log("dataset", data);
			message.success("Dataset created");
			next();
		}
	}

	const handleFinishUpload = () => {
		updateImages(name);
		next();
	}

	return (
		<>
			<Row>
				<Col span={24}>
					<h1>New Dataset</h1>
				</Col>
			</Row>
			<Row>
				<Steps current={current} items={items} />
				<div
					style={{
						width: "100%",
						paddingTop: 12,
						marginTop: 12,
						minHeight: 300,
						display: "flex",
						justifyContent: "center",
						alignItems: "start",
						border: "1px dashed #e9e9e9",
						borderRadius: 2,
						backgroundColor: "#fafafa",
						textAlign: "center",
					}}
				>
					{current === 0 && (
						<>
							<Input
								placeholder="Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/><br/>
							<Input
								placeholder="Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</>

					)}
					{current === 1 && (
						<Dragger {...props}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">
								Click or drag file to this area to upload
							</p>
							<p className="ant-upload-hint">
								Support for a single or bulk upload. Strictly prohibited from
								uploading company data or other banned files.
							</p>
						</Dragger>
					)}
					{current === 2 && (
						<Dragger {...props2}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">
								Click or drag file to this area to upload
							</p>
							<p className="ant-upload-hint">
								Support for a single or bulk upload. Strictly prohibited from
								uploading company data or other banned files.
							</p>
						</Dragger>
					)}
				</div>

				<div
					style={{
						marginTop: 24,
					}}
				>
					{current === 0 && (
						<Button type="primary" onClick={handleCreateDataset}>
							Create Dataset
						</Button>
					)}
					{current === 1 && (
						<Button type="primary" onClick={handleFinishUpload}>
							Finish Upload
						</Button>
					)}
					{current === 2 && (
						<Button type="primary" href="/datasets">
							Done
						</Button>
					)}
				</div>
			</Row>
		</>
	);
}

export default Datasets;
