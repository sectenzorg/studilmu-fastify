# Setup and Running studilmu-fastify Application

This guide will help you set up and run the **studilmu-fastify** application using Docker and the `run.sh` script.

## Prerequisites

Before starting, make sure you have the following software installed:

- **Docker** – Ensure Docker is installed on your system. If not, follow the installation guide [here](https://docs.docker.com/get-docker/).


## Steps

### 1. Clone the Repository

First, clone the **studilmu-fastify** repository from GitHub:

```
git clone https://github.com/sectenzorg/studilmu-fastify
```

After the repository is cloned, navigate to the project directory:

```
cd studilmu-fastify
```

### 2. Verify Docker Installation

Ensure Docker is installed and running on your system by checking the version:

```
docker --version
```

If Docker is not installed, please download and install Docker Desktop from Docker's official website.

### 3. Grant Execute Permissions to `run-arm.sh`

Ensure the `run.sh` script has execute permissions. Run the following command:

```
chmod +x run-arm.sh
```

### 4. Run the `run-arm.sh` Script

Once the script has execute permissions, you can run the `run-arm.sh` script to build the Docker image and start the container.

```
./run.sh
```

#### What the Script Does:

- 🚫 Stops and removes any existing container named `studilmu-fastify` if it exists.
- 🔨 Rebuilds the Docker image based on the `Dockerfile` located in `.devops/Dockerfile`.
- 🚀 Starts a new container using the newly built image and maps port 5000 from the container to port 5000 on the host.

### 5. Verify the Container is Running

After the script completes, verify that the container is running with the following command:

```
docker ps
```

This will show a list of running containers. Make sure that the container with the name `studilmu-fastify` is listed.

### 6. Access the Application

If the application inside the container is listening on port 5000, you can access it in your browser by navigating to:

```
http://localhost:5000
```

If you are accessing from a server or another device, replace `localhost` with the appropriate IP address of the server.

## Notes

- ⚠️ **Docker must be running** on your system for the script to work.
- 🔄 The script rebuilds the Docker image every time it runs to ensure that you are using the latest version of the application.
