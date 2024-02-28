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

## Open To-Do's

- [ ] Show model training process in UI
  - For now, to monitor a model's execution, refer to the express server logs. The process is deemed complete upon the appearance of the message "FINISHED exporting model {{ MODEL NAME }}" in the console. Logs can be accessed through Portainer or by executing `docker compose logs --follow gpu-api` to follow the API server logs.
- [ ] Identify correct camera poses in 3d viewer
  - The 3d viewer does not show the results because the camera might not point to the object. You can verify the mesh was created by downloading it and seeing it in a online [3D viewer](https://3dviewer.net/)
- [ ] Delete temporary directories
  - We have disabled this feature because this project is still under development and being able to inspect temporary directories facilitates debugging. These should be abviously be deleted in a production version.
- [ ] Improve error feedback to user
  - When training NeRF we ran into a myriad of problems while setting them up. Since users of the app shouldn't have to inspect the server logs to find out what caused errors in their model, it's highly important to provide exhaustive error feedback inside the UI
