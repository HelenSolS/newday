#!/bin/bash

# Deployment script for NewDay Platform
echo "Deploying NewDay Platform..."

# Create data directory with proper permissions
echo "Creating data directory..."
mkdir -p src/backend/data
chown -R 1000:1000 src/backend/data

# Update .env file with allowed origins
echo "Updating .env file..."
sed -i.bak 's|^ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://newday.neyronikol.ru,https://api.newday.neyronikol.ru,http://newday.neyronikol.ru|' .env
grep ^ALLOWED_ORIGINS .env

# Create config.js for frontend
echo "Creating frontend config..."
mkdir -p src/frontend
echo 'window.APP_CONFIG = { API_BASE: "https://api.newday.neyronikol.ru" };' > src/frontend/config.js

# Stop and remove existing containers
echo "Stopping existing containers..."
docker compose down

# Build and start services
echo "Building and starting services..."
docker compose up -d --build

# Wait a moment for services to start
sleep 5

# Show running containers
echo "Checking running containers..."
docker ps

# Show logs
echo "Showing backend logs..."
docker logs newday-backend

echo "Showing frontend logs..."
docker logs newday-frontend

echo "Deployment completed!"
echo "Frontend will be available at: https://newday.neyronikol.ru"
echo "API will be available at: https://api.newday.neyronikol.ru"