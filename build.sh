#!/bin/bash

# Clean up node modules and .next directory
echo "Cleaning up previous build artifacts..."
rm -rf node_modules
rm -rf .next

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully! Run 'npm start' to start the application."
