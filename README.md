# CloudNeRF Documentation

Welcome to CloudNeRF, a cutting-edge platform designed for efficient neural radiance field processing in cloud environments. This documentation provides comprehensive guidance on setting up and using CloudNeRF, ensuring a seamless experience for users aiming to leverage neural radiance fields in their projects.

## Getting Started

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

## Setup Instructions

### Environment Files

1. Rename `./CloudNeRF/.env.example` to `.env`.
1. Provide the following env variables:
    - `REACT_APP_API_ENDPOINT_URL`: URL to the server hosting the express server, typically http://localhost:5000 for local setups. For remote servers, use the public IP or domain name, ensuring port 5000 is accessible.
    - `ROOT_DIR`: absolute path to the project root. E.g. `/home/ubuntu/CloudNeRF`

### Operational Notes

- Model Execution: To monitor a model's execution, refer to the express server logs. The process is deemed complete upon the appearance of the message "FINISHED exporting model {{ MODEL NAME }}" in the console. Logs can be accessed through Portainer or by executing `docker compose logs --follow gpu-api` to follow the API server logs.
- 3D Viewer: The 3d viewer does not show the results because the camera might not point to the object. You can verify the mesh was created by downloading it and seeing it in a online [3D viewer](https://3dviewer.net/)
