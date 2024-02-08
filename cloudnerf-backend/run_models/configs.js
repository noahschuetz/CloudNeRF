export const runModelsConfigs = [
	{
		modelId: "instantngp",
		cmd: "docker",
		cmdArgs: [
			"run",
			"--gpus",
			"all",
			"-v",
			`${process.env.ROOT_DIR}/tmp/instantngp/data/:/workspace/data/`,
            "--rm",
            "--shm-size=12gb",
            "dromni/nerfstudio:1.0.0",
            "ns-train",
            "instant-ngp",
            "--data",
            "/workspace/data"
		],
	},
];
