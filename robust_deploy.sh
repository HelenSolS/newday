#!/bin/bash

# Robust deployment script for NewDay Platform
echo "Starting NewDay Platform deployment..."

# Create deployment package
echo "Creating deployment package..."
tar -czf newday-platform-deploy.tar.gz src docker-compose.yml .env server_deploy.sh

echo "Deployment package created successfully."

# Instructions for manual deployment
echo "=================================================="
echo "MANUAL DEPLOYMENT INSTRUCTIONS:"
echo "=================================================="
echo "1. Copy the deployment package to your server:"
echo "   scp newday-platform-deploy.tar.gz root@45.153.189.27:/root/"
echo ""
echo "2. SSH into your server:"
echo "   ssh root@45.153.189.27"
echo ""
echo "3. Once on the server, run these commands:"
echo "   sudo mkdir -p /var/www/newday"
echo "   sudo mv /root/newday-platform-deploy.tar.gz /var/www/newday/"
echo "   cd /var/www/newday"
echo "   tar -xzf newday-platform-deploy.tar.gz"
echo "   chmod +x server_deploy.sh"
echo "   chmod +x src/backend/*.sh"
echo "   ./server_deploy.sh"
echo "=================================================="

echo "Deployment instructions generated. Please follow the steps above manually."