#!/bin/bash

# Define the local directory where the volume contents will be copied.
LOCAL_DIR=/home/avi/Desktop/spe/finance-tracker/data

# Define a function to copy the volume contents to the local directory.
copy_volume_contents() {
  container_id=$904aa44ff803
  echo "Copying volume contents for container $container_id..."
  docker cp $container_id:/data $LOCAL_DIR/$container_id
}

# Register the function to be called when the container is stopped.
trap 'copy_volume_contents $HOSTNAME' SIGTERM

# Loop indefinitely to keep the container running.
while true; do
  sleep 3600
done