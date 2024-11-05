#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Start the FastAPI backend
echo "Starting the FastAPI backend..."
uvicorn api.auth:app --reload &

# Start the Webpack development server for the frontend
echo "Starting the Webpack development server..."
npm start