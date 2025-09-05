#!/bin/bash

# Improved deployment script for NewDay Platform
echo "Starting NewDay Platform deployment..."

# Create deployment package
echo "Creating deployment package..."
tar -czf newday-platform-deploy.tar.gz src docker-compose.yml .env server_deploy.sh

# Copy to server
echo "Copying deployment package to server..."
scp newday-platform-deploy.tar.gz root@45.153.189.27:/root/

# SSH to server and deploy
echo "Deploying on server..."
ssh root@45.153.189.27 << 'ENDSSH'
# Create directory and extract
sudo mkdir -p /var/www/newday
sudo mv /root/newday-platform-deploy.tar.gz /var/www/newday/
cd /var/www/newday
tar -xzf newday-platform-deploy.tar.gz

# Make scripts executable
chmod +x server_deploy.sh
chmod +x src/backend/*.sh

# Run deployment script
./server_deploy.sh

# Additional checks
echo "Performing additional health checks..."

# Wait a bit more for services to stabilize
sleep 10

# Check if containers are running
echo "Checking container status..."
docker ps | grep newday

# Check backend health endpoint
echo "Checking backend health..."
curl -f https://api.newday.neyronikol.ru/health || echo "Backend health check failed"

# Check frontend
echo "Checking frontend..."
curl -f https://newday.neyronikol.ru/ || echo "Frontend check failed"

echo "Enhanced deployment completed!"
ENDSSH

echo "Enhanced deployment completed!"