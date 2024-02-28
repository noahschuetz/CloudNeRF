# CloudNeRF Documentation

Welcome to CloudNeRF, a cutting-edge platform designed for efficient neural radiance field processing in cloud environments. This documentation provides comprehensive guidance on setting up and using CloudNeRF, ensuring a seamless experience for users aiming to leverage mesh creation with neural radiance fields in their projects.

## Getting Started

1. First make sure that your machine meets the hard- and software requirements mentioned below.
2. Then follow the setup instructions by providing the correct environment variables for your system.
3. Run `docker compose up -d`
4. UI will be exposed at port 3000. Connect either via http://localhost:3000 or https://your-qualified-domain-name.tld. For production builds we recommend exposing the UI through a proxy server such as nginx
5. (optional) Inspect logs of the background processes triggered by the UI with `docker compose logs --follow gpu-api`  

## Requirements

To begin using CloudNeRF, ensure that your system meets the following hardware and software requirements.

### Hardware Requirements

- GPU: CUDA-capable GPU with a minimum of 16GB memory.
- System: Linux operating system.
- Storage: Minimum of 100GB disk space available.
- Memory: 32GB RAM recommended for optimal performance.

### Software Requirements

- Node.js: Version 18 or higher. Installation via nvm is recommended for ease of use. Note: This is only necessary if you plan to start the API server independently. For Docker Compose setups, Node.js is not required. \
[Installation Guide](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- Docker: Ensure Docker is installed and configured correctly. Users executing the API server must have permissions to launch containers, achievable by adding the user to the Docker group. \
[Installation Guide](https://docs.docker.com/engine/install/ubuntu/) | [Post-Install Steps](https://docs.docker.com/engine/install/linux-postinstall/)
- NVIDIA Drivers: Latest NVIDIA drivers compatible with your GPU. \
[Installation Notes](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html)
- NVIDIA Container Toolkit: Required for Docker to utilize the NVIDIA GPU. \
[Installation Guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

### Optional:

- Portainer: An optional tool that facilitates container management, allowing users to monitor running containers and inspect logs. This is particularly useful for tracking model runs. \
[Installation Guide](https://docs.portainer.io/start/install-ce/server/docker/linux)

## Setup environment files

1. Rename `./CloudNeRF/.env.example` to `.env`.
1. Provide the following env variables:
    - `REACT_APP_API_ENDPOINT_URL`: URL to the server hosting the express server, typically http://localhost:5000 for local setups. For remote servers, use the public IP or domain name, ensuring port 5000 is accessible.
    - `ROOT_DIR`: absolute path to the project root. E.g. `/home/ubuntu/CloudNeRF`

## Contributing

Contributing to this project works mainly by extending it to support more datasets and more NeRF methods. Both can be done by adding entries in the respective configuration files:

- To add support for a new dataset you have to extend the file `./cloudnerf-backend/fetch_datasets/configs.js`. As an example we will describe how the config of the blender dataset is setup:

  ```js
  {
    fetchId: "blender",
    cmd: "docker",
    cmdArgs: [
      "run",
      "--volume",
      `${process.env.ROOT_DIR}/tmp/blender/:/workspace/`,
      "--rm",
      "--shm-size=12gb",
      "nerfstudio/nerfstudio:latest",
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
  ```
  - `fetch_id` is the id of the id of the bundle of models that are downloaded.
  - `cmd` and `cmdArgs` specify the command to download the datasets. In this case we simply used the data retrieval provided by nerfstudio. The volume mount makes sure that the data is downloaded into the temporary directory for the download process, which is `<project_root>/tmp/<fetch_id>`. If you add configuration for a new dataset, you should also use this temporary directory.
  - `datasetPaths` are tuples of the model id and the respective relative path in the temporary directory
  - `description` is a description of the whole bundle. This is shown in the UI.
  - `datasetType` specifies the type of transforms.json that is used. Refer to the [Nerfstudio documentation](https://docs.nerf.studio/developer_guides/pipelines/dataparsers.html#included-dataparsers) for more information

- To add support for a new NeRF method you have to extend the file `./cloudnerf-backend/run_models/configs.js`. An example for the nerfacto method is shown below:

  ```js
  {
    modelId: "nerfacto",
    displayName: "Nerfacto",
    dockerImage: "nerfstudio/nerfstudio",
    installCmd: ["docker", "pull", "nerfstudio/nerfstudio:latest"],
    runCmdFn: (datasetId, datasetType) => [
      "docker",
      "run",
      "--gpus",
      "all",
      "-v",
      `${process.env.ROOT_DIR}/tmp/nerfacto/:/workspace/`,
      "--rm",
      "--shm-size=12gb",
      "nerfstudio/nerfstudio:latest",
      "ns-train",
      "nerfacto",
      "--pipeline.model.predict-normals",
      "True",
      "--viewer.quit-on-train-completion",
      "True",
      "--timestamp",
      "latest",
      "--data",
      `/workspace/data/${datasetId}`,
      datasetType,
      datasetType === "nerfstudio-data" ? "--downscale-factor" : "",
      datasetType === "nerfstudio-data" ? "4" : "",
    ],
    exportCmdFn: (datasetId) => [
      "docker",
      "run",
      "--gpus",
      "all",
      "-v",
      `${process.env.ROOT_DIR}/tmp/nerfacto/:/workspace/`,
      "--rm",
      "--shm-size=12gb",
      "nerfstudio/nerfstudio:latest",
      "ns-export",
      "poisson",
      "--load-config",
      `outputs/${datasetId}/nerfacto/latest/config.yml`,
      "--output-dir",
      process.env.MESH_RESULTS_DIR_NAME,
    ],
    exportedMeshFile: "poisson_mesh.ply"
  },
  ```
  - `modelId` is the ID for the model that is used in the backend for naming things in the storage and for temporary directory
  - `displayName` is the name shown in the UI
  - `dockerImage` is the Docker image that enables running this model. This is used to identify whether the model is "installed", which basically means that its respective docker image is available locally.
  - `installCmd` is the command to install the model. Usually this will be the command to pull the Docker image. But you may also specify custom Dockerfiles (as was done for K-Planes)
  - `runCmdFn` is a function receiving the datasetId on which the model is trained and its datasetType (see above in the configuration of datasets) and outputs the command to train the model. Here we again make use of the temporary directory that is created for model runs: `<project_root>/tmp/<model_id>`. The dataset is loaded into `<project_root>/tmp/<model_id>/data/<dataset_id>`. Here we can see that we did some adjustments specific to the nerfstudio datasets because using full sized images break the RAM of our machine causing it to crash (which is very annoying if you have to notify your supervisor everytime it happens so he can restart the server :grin: )
  - `exportCmdFn` is a function that receives the datasetId and outputs the command to export the mesh of the model. The mesh should be placed into `<project_root>/tmp/<model_id>/results` (the name "results" is specified in the `MESH_RESULTS_DIR_NAME` env variable, so it might be changed).
  - `exportedMeshFile` is the name of the file that contains the mesh. So it should be located at `<project_root>/tmp/<model_id>/results/<exportedMeshFile>`


## Open To-Do's

- [ ] Show model training process in UI
  - For now, to monitor a model's execution, refer to the express server logs. The process is deemed complete upon the appearance of the message "FINISHED exporting model {{ MODEL NAME }}" in the console. Logs can be accessed through Portainer or by executing `docker compose logs --follow gpu-api` to follow the API server logs.
- [ ] Identify correct camera poses in 3d viewer
  - The 3d viewer does not show the results because the camera might not point to the object. You can verify the mesh was created by downloading it and seeing it in a online [3D viewer](https://3dviewer.net/)
- [ ] Delete temporary directories
  - We have disabled this feature because this project is still under development and being able to inspect temporary directories facilitates debugging. These should be abviously be deleted in a production version.
- [ ] Improve error feedback to user
  - When training NeRF we ran into a myriad of problems while setting them up. Since users of the app shouldn't have to inspect the server logs to find out what caused errors in their model, it's highly important to provide exhaustive error feedback inside the UI
- [ ] Automatically create transforms.json instead of uploading own.
