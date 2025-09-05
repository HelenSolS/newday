#!/bin/bash

# Auto Deployment Script for NewDay Platform
# This script should be run on your local Mac

echo "=== NewDay Platform Auto Deployment ==="
echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "server_deploy.sh" ]; then
    echo "Error: Please run this script from the /Users/lena/NewDay directory"
    exit 1
fi

echo "1. Creating deployment archive..."
tar -czf newday-platform-deploy.tar.gz src docker-compose.yml .env server_deploy.sh

if [ $? -ne 0 ]; then
    echo "Error: Failed to create deployment archive"
    exit 1
fi

echo "2. Deployment archive created successfully!"

echo "3. Please manually copy the archive to the server using:"
echo "   scp newday-platform-deploy.tar.gz root@45.153.189.27:/root/"
echo ""
echo "4. Then SSH into the server:"
echo "   ssh root@45.153.189.27"
echo ""
echo "5. Once connected to the server, run these commands:"
echo "   mkdir -p /var/www/newday"
echo "   mv /root/newday-platform-deploy.tar.gz /var/www/newday/"
echo "   cd /var/www/newday"
echo "   tar -xzf newday-platform-deploy.tar.gz"
echo "   chmod +x server_deploy.sh"
echo "   chmod +x src/backend/*.sh"
echo "   ./server_deploy.sh"
echo ""
echo "Deployment script completed! Follow the manual steps above to complete deployment."