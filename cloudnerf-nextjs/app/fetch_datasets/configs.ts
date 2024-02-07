import { assertValue } from "@/utils";

export interface FetchDatasetConfig {
	fetchId: string;
	cmd: string;
	cdmArgs?: string[];
	datasetPaths: [string, ...string[]];
}

export const fetchDatasetConfigs: FetchDatasetConfig[] = [
	{
		fetchId: "blender",
		cmd: "docker",
		cdmArgs: [
			"run",
			"-v",
			`${assertValue(process.env.ROOT_DIR)}/tmp/blender/:/workspace/`,
			"--rm",
			"--shm-size=12gb",
			"dromni/nerfstudio:1.0.0",
			"ns-download-data",
			"blender",
		],
		datasetPaths: [
			"data/blender/chair",
			"data/blender/drums",
			"data/blender/ficus",
			"data/blender/hotdog",
			"data/blender/lego",
			"data/blender/materials",
			"data/blender/mic",
			"data/blender/ship",
		],
	},
];
