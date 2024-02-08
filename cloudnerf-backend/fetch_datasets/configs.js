import { config } from "dotenv";
config();

export const fetchDatasetConfigs = [
	{
		fetchId: "blender",
		cmd: "docker",
		cmdArgs: [
			"run",
			"--volume",
			`${process.env.ROOT_DIR}/tmp/blender/:/workspace/`,
			"--rm",
			"--shm-size=12gb",
			"dromni/nerfstudio:1.0.0",
			"ns-download-data",
			"blender",
		],
		datasetPaths: [
			[
				"chair",
				"data/blender/chair/train",
				"data/blender/chair/transforms_train.json",
			],
			[
				"drums",
				"data/blender/drums/train",
				"data/blender/drums/transforms_train.json",
			],
			[
				"ficus",
				"data/blender/ficus/train",
				"data/blender/ficus/transforms_train.json",
			],
			[
				"hotdog",
				"data/blender/hotdog/train",
				"data/blender/hotdog/transforms_train.json",
			],
			[
				"lego",
				"data/blender/lego/train",
				"data/blender/lego/transforms_train.json",
			],
			[
				"materials",
				"data/blender/materials/train",
				"data/blender/materials/transforms_train.json",
			],
			[
				"mic",
				"data/blender/mic/train",
				"data/blender/mic/transforms_train.json",
			],
			[
				"ship",
				"data/blender/ship/train",
				"data/blender/ship/transforms_train.json",
			],
		],
	},
	{
		fetchId: "nerfstudio",
		cmd: "docker",
		cmdArgs: [
			"run",
			"--volume",
			`${process.env.ROOT_DIR}/tmp/nerfstudio/:/workspace/`,
			"--rm",
			"--shm-size=12gb",
			"dromni/nerfstudio:1.0.0",
			"ns-download-data",
			"nerfstudio",
			"--capture-name",
			"all"
		],
		datasetPaths: [
			"bww_entrance",
			"data/nerfstudio/bww_entrance/images",
			"data/nerfstudio/bww_entrance/transforms.json"
		]
	}
];
