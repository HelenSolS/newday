#!/bin/bash

# Server deployment script for NewDay Platform
echo "Deploying NewDay Platform to server..."

# Navigate to project directory
echo "Changing to project directory..."
cd /var/www/newday

# 1) Fix .env (allow Origins for frontend and API domains)
echo "Updating .env file with allowed origins..."
sed -i 's|^ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://newday.neyronikol.ru,https://api.newday.neyronikol.ru,http://newday.neyronikol.ru|' .env
grep ^ALLOWED_ORIGINS .env

# 2) Configure frontend: set API endpoint
echo "Creating frontend config..."
mkdir -p frontend
echo 'window.APP_CONFIG = { API_BASE: "https://api.newday.neyronikol.ru" };' > frontend/config.js

# 3) Create minimal index.html if it doesn't exist
# (Skipping this step as we already have a full frontend)

# 4) Update docker-compose.yml with Traefik configuration
echo "Backing up and updating docker-compose.yml..."
cp docker-compose.yml docker-compose.yml.bak

cat > docker-compose.yml <<'EOFDC'
services:
  backend:
    build: ./src/backend
    container_name: newday-backend
    restart: always
    env_file: .env
    volumes:
      - ./src/backend:/app
      - ./src/backend/data:/app/data
    # Don't expose port externally - route through Traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.newday-backend.rule=Host(\`api.newday.neyronikol.ru\`)"
      - "traefik.http.routers.newday-backend.entrypoints=websecure"
      - "traefik.http.routers.newday-backend.tls=true"
      - "traefik.http.services.newday-backend.loadbalancer.server.port=8001"
    networks:
      - n8n_default

  frontend:
    image: nginx:alpine
    container_name: newday-frontend
    restart: always
    volumes:
      - ./src/frontend:/usr/share/nginx/html:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.newday-frontend.rule=Host(\`newday.neyronikol.ru\`)"
      - "traefik.http.routers.newday-frontend.entrypoints=websecure"
      - "traefik.http.routers.newday-frontend.tls=true"
      - "traefik.http.services.newday-frontend.loadbalancer.server.port=80"
    networks:
      - n8n_default

networks:
  n8n_default:
    external: true
EOFDC

# 5) Restart services
echo "Stopping existing containers..."
docker compose down

echo "Building and starting services..."
docker compose up -d --build

# 6) Perform checks
echo "Waiting for services to start..."
sleep 5

echo "Checking running containers..."
docker ps

echo "Showing backend logs..."
docker logs -n 50 newday-backend

echo "Showing frontend logs..."
docker logs -n 50 newday-frontend

# 7) Quick test
echo "Performing quick API test..."
curl -s https://api.newday.neyronikol.ru/health || true

echo "Deployment completed!"
echo "Frontend will be available at: https://newday.neyronikol.ru"
echo "API will be available at: https://api.newday.neyronikol.ru"