# NewDay Platform Deployment

This document provides instructions for deploying the NewDay Platform with separate frontend and backend services using Docker and Traefik.

## Prerequisites

1. Docker and Docker Compose installed
2. Traefik network (`n8n_default`) created
3. DNS records configured:
   - `newday.neyronikol.ru` → 45.153.189.27
   - `api.newday.neyronikol.ru` → 45.153.189.27

## Deployment Steps

### 1. DNS Configuration

Add the following A records to your DNS provider:
```
A newday.neyronikol.ru → 45.153.189.27
A api.newday.neyronikol.ru → 45.153.189.27
```

### 2. Environment Setup

Update the `.env` file with your configuration:
```bash
# Database
DATABASE_URL=sqlite:////app/data/newday_platform.db

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://newday.neyronikol.ru,https://api.newday.neyronikol.ru,http://newday.neyronikol.ru

# API Settings
API_V1_STR=/api
```

### 3. Deploy Services

Run the deployment script:
```bash
./deploy.sh
```

This will:
- Create necessary directories with proper permissions
- Update environment variables
- Build and start both frontend and backend services
- Configure Traefik routing for both services

### 4. Server Deployment

For deployment directly on the server, use the server deployment script:
```bash
./server_deploy.sh
```

This script performs the exact steps specified for server deployment:
- Updates environment variables
- Configures frontend API endpoint
- Updates docker-compose.yml with Traefik configuration
- Restarts services
- Performs verification checks

### 5. Services

After deployment, you will have:

- **Frontend**: https://newday.neyronikol.ru
- **Backend API**: https://api.newday.neyronikol.ru

### 6. Verification

Check that services are running:
```bash
docker ps
```

Check logs:
```bash
docker logs newday-frontend
docker logs newday-backend
```

Test API:
```bash
./check_api.sh
```

## Directory Structure

```
/var/www/newday/
├── .env
├── docker-compose.yml
├── deploy.sh
├── server_deploy.sh
├── check_api.sh
├── src/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── config.js
│   │   └── ...
│   └── backend/
│       ├── Dockerfile
│       ├── requirements.txt
│       ├── main.py
│       └── ...
```

## Troubleshooting

### CORS Issues

If you encounter CORS issues, verify that `ALLOWED_ORIGINS` in `.env` includes:
- https://newday.neyronikol.ru
- https://api.newday.neyronikol.ru
- http://newday.neyronikol.ru

### SSL Certificate Issues

Traefik automatically handles SSL certificates. If there are issues:
1. Check that DNS records are correctly configured
2. Wait a few minutes for certificates to be issued
3. Check Traefik logs for errors

### Database Permissions

If the backend container restarts continuously:
1. Ensure the data directory has correct permissions:
   ```bash
   mkdir -p src/backend/data
   chown -R 1000:1000 src/backend/data
   ```

## Updating the Platform

To update the platform:

1. Pull the latest code
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

This will rebuild and restart the services with the latest code.