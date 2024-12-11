#!/bin/bash

# Container and image names
CONTAINER_NAME="studilmu-fastify"
IMAGE_NAME="studilmu-fastify:1.0"

# Check if the container already exists
if docker ps -a --filter "name=$CONTAINER_NAME" | grep -q $CONTAINER_NAME; then
  docker stop $CONTAINER_NAME  # Stop the running container
  docker rm $CONTAINER_NAME    # Remove the container
else
  echo "Container not found."
fi

# Rebuild the image every time
echo "Rebuilding the Docker image..."
docker build -t $IMAGE_NAME -f .devops/Dockerfile .

# Start the container again (new or recreated)
echo "Starting the container..."
docker run -dit --name $CONTAINER_NAME -p 5000:5000 $IMAGE_NAME
