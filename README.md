# CloudNeRF

## Getting Started

### Hardware requirements

- CUDA-capable GPU with at least 16GB of memory
- Linux machine
- At least 100GB of disk space
- 32GB of RAM are recommended

### Software requirements

- Node.js 18+ installed (nvm recommended) (only needed if starting api server separately, if using docker compose this is not necessary)
- [Docker installed](https://docs.docker.com/engine/install/ubuntu/), make sure the user that executes the api server [is in the docker group](https://docs.docker.com/engine/install/linux-postinstall/) to be able to launch containers.npm
- [Latest nvidia drivers installed](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html)
- [nvidia-container-toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

_optional:_
- [Portainer](https://docs.portainer.io/start/install-ce/server/docker/linux) to keep track of running containers and inspect logs of specific containers. Useful to track the current run of a model. 

### Setup

1. Copy or rename `./CloudNeRF/.env.example` to `.env`
2. Copy or rename `./CloudNeRF/cloudnerf-backend/.env.example` to `.env` and insert correct values:
  1. `ROOT_DIR` is the absolute path to the `cloudnerf-backend` directory
  2. `SUPABASE_KEY` is the `SERVICE_ROLE_KEY` or `ANON_KEY` specified in `./CloudNeRF/.env`
  3. `SUPABASE_URL` is the URL to the kong service from supabase. If you didn't change the ports in the supabase configuration in `./CloudNeRF/.env` and supabase is running on the same server as the express server, this value should be `http://localhost:8000`
  4. `MESH_RESULTS_DIR_NAME` can be left as is.
3. Copy or rename `./CloudNeRF/cloudnerf-frontend/.env.example` to `.env` and insert correct values:
  1. `REACT_APP_API_ENDPOINT_URL` is the URL to the server where the express server is running on. The server runs on port 5000. If the express server runs on the same machine as the React client (your browser), the value should be `http://localhost:5000`. Otherwise use the public IP or domain name of your server. In the case of GCP or AWS please make sure that the port 5000 is accessible.


### Notes

- When running a model nothing happens. One has to check the logs of the express server to check the process. Process is finished (maybe it failed) when the message "FINISHED exporting model {{ MODEL NAME }}" appears in the console.
  - Logs can be checked either via Portainer (see above) or by following the logs of the API server, e.g. `dpocker compose logs --follow gpu-api` 
- The 3d viewer does not show the results because the camera might not point to the object
