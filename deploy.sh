#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the project
echo "Building the project..."
npm run build

# Define server details
SERVER_USER="your_actual_username"  # Replace with your actual server username
SERVER_HOST="your_actual_server_address"  # Replace with your actual server address
SERVER_PATH="/var/www/your_actual_project_directory"  # Replace with your actual project directory on the server

# Deploy to server
echo "Deploying to server..."
scp -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH

echo "Deployment complete!" 