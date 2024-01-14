import React from "react";

import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Divider, message, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
const { Dragger } = Upload;

const props = {
	name: "file",
	multiple: true,
	action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
	onChange(info: UploadChangeParam<UploadFile>) {
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
	onDrop(e: React.DragEvent<HTMLDivElement>) {
		console.log("Dropped files", e.dataTransfer.files);
	},
};

const InputComponent = () => {
	return (
		<div style={{ minHeight: "calc(70vh - 64px)" }}>
			<Divider orientation="left" orientationMargin="0">
				Input Data
			</Divider>

			<div style={{ margin: "12px" }}>
				<Dragger {...props}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">
						Click or drag images or video to this area to upload
					</p>
				</Dragger>

				<Button type="primary" block style={{ marginTop: "12px" }}>
					Process with COLMAP
				</Button>
				<div style={{ marginTop: "12px" }}>
					Already have a .json file? Upload it here:
					<Upload {...props}>
						<Button
							icon={<UploadOutlined />}
							style={{ marginLeft: "10px", width: "100%" }}
						>
							Upload .json
						</Button>
					</Upload>
				</div>
			</div>
		</div>
	);
};

export default InputComponent;
