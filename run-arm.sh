#!/bin/bash

# Container and image names
CONTAINER_NAME="lms-be-development"
IMAGE_NAME="277707103873.dkr.ecr.ap-southeast-3.amazonaws.com/lms-be-development:latest"

# Check if the container already exists
if docker ps -a --filter "name=$CONTAINER_NAME" | grep -q $CONTAINER_NAME; then
  docker stop $CONTAINER_NAME  # Stop the running container
  docker rm $CONTAINER_NAME    # Remove the container
else
  echo "Container not found."
fi

# Rebuild the image every time
echo "Rebuilding the Docker image..."
docker buildx build --platform linux/arm64 -t $IMAGE_NAME -f .devops/Dockerfile --load .

# Start the container again (new or recreated)
echo "Starting the container..."
docker run -dit --platform linux/arm64 --name $CONTAINER_NAME -p 5000:5000 $IMAGE_NAME
