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
			["chair", "data/blender/chair"],
			["drums", "data/blender/drums"],
			["ficus", "data/blender/ficus"],
			["hotdog", "data/blender/hotdog"],
			["lego", "data/blender/lego"],
			["materials", "data/blender/materials"],
			["mic", "data/blender/mic"],
			["ship", "data/blender/ship"],
		],
		description: "Downloaded via blender bundle",
		datasetType: "blender-data",
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
			"all",
		],
		datasetPaths: [
			// [id, path]
			["bww_entrance", "data/nerfstudio/bww_entrance"],
			["campanile", "data/nerfstudio/campanile"],
			["desolation", "data/nerfstudio/desolation"],
			["library", "data/nerfstudio/library"],
			["poster", "data/nerfstudio/poster"],
			["redwoods2", "data/nerfstudio/redwoods2"],
			["storefront", "data/nerfstudio/storefront"],
			["vegetation", "data/nerfstudio/vegetation"],
			["Egypt", "data/nerfstudio/Egypt"],
			["person", "data/nerfstudio/person"],
			["kitchen", "data/nerfstudio/kitchen"],
			["plane", "data/nerfstudio/plane"],
			["dozer", "data/nerfstudio/dozer/"],
			["floating-tree", "data/nerfstudio/floating-tree"],
			["aspen", "data/nerfstudio/aspen"],
		],
		description: "Downloaded via nerfstudio bundle",
		datasetType: "nerfstudio-data",
	},
];
