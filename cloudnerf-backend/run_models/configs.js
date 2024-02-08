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
	{
		modelId: "neus",
		cmd: "docker",
		cmdArgs: [
			"run",
			"--gpus",
			"all",
			"-v",
			`${process.env.ROOT_DIR}/tmp/neus/data/:/workspace/data/`,
            "--rm",
            "--shm-size=12gb",
            "dromni/nerfstudio:1.0.0",
            "ns-train",
            "neus",
            "--data",
            "/workspace/data"
		],
	},
	{
		modelId: "nerfacto",
		cmd: "docker",
		cmdArgs: [
			"run",
			"--gpus",
			"all",
			"-v",
			`${process.env.ROOT_DIR}/tmp/nerfacto/data/:/workspace/data/`,
            "--rm",
            "--shm-size=12gb",
            "dromni/nerfstudio:1.0.0",
            "ns-train",
            "nerfacto",
            "--data",
            "/workspace/data"
		],
	},
];
