# NewDay Platform - Server Deployment Instructions

## Server Information
- **IP Address**: 45.153.189.27
- **SSH User**: root
- **Project Directory**: /var/www/newday

## Deployment Steps

### 1. Connect to Server
```bash
ssh root@45.153.189.27
```

### 2. Create Project Directory
```bash
mkdir -p /var/www/newday
cd /var/www/newday
```

### 3. Upload Project Files
Upload the following files and directories to `/var/www/newday`:
- src/ (entire directory)
- docker-compose.yml
- .env
- server_deploy.sh

### 4. Set Permissions
```bash
chmod +x server_deploy.sh
chmod +x src/backend/*.sh
```

### 5. Run Deployment Script
```bash
./server_deploy.sh
```

## Directory Structure After Deployment
```
/var/www/newday/
├── src/
│   ├── backend/
│   │   ├── models.py
│   │   ├── main.py
│   │   ├── course_endpoints.py
│   │   ├── n8n_endpoints.py
│   │   ├── n8n_integration.py
│   │   ├── populate_database.py
│   │   ├── convert_webinar_to_blocks.py
│   │   ├── requirements.txt
│   │   └── ...
│   └── frontend/
│       ├── index.html
│       ├── config.js
│       └── ...
├── docker-compose.yml
├── .env
└── server_deploy.sh
```

## New API Endpoints Available

### Content Blocks Management
- POST /api/courses/blocks - Create a new content block
- GET /api/courses/blocks - Get all content blocks
- GET /api/courses/blocks/{block_id} - Get a specific content block
- PUT /api/courses/blocks/{block_id} - Update a content block

### Course Management
- POST /api/courses/ - Create a new course
- GET /api/courses/ - Get all courses
- GET /api/courses/{course_id} - Get a specific course
- POST /api/courses/course-blocks - Assign a content block to a course
- POST /api/courses/build-course/{course_id} - Automatically build course schedule
- GET /api/courses/{course_id}/schedule - Get course schedule

## Testing After Deployment

### Check if services are running
```bash
docker ps
```

### Test API Health
```bash
curl -s https://api.newday.neyronikol.ru/health
```

### Test Course API
```bash
curl -s https://api.newday.neyronikol.ru/api/courses/blocks
```

## Access Points
- **Frontend**: https://newday.neyronikol.ru
- **Backend API**: https://api.newday.neyronikol.ru
- **API Documentation**: https://api.newday.neyronikol.ru/docs

## Troubleshooting

### If containers fail to start
```bash
docker compose down
docker compose up -d --build
```

### Check logs
```bash
docker logs newday-backend
docker logs newday-frontend
```

### If database issues occur
```bash
# Remove existing database
rm -f src/backend/data/newday_platform.db

# Rebuild and restart
docker compose down
docker compose up -d --build
```

## Next Steps After Deployment

1. Convert existing webinar content to blocks:
   ```bash
   docker exec -it newday-backend python convert_webinar_to_blocks.py
   ```

2. Populate database with initial content:
   ```bash
   curl -X POST https://api.newday.neyronikol.ru/populate-database
   ```

3. Test new course endpoints through Swagger UI at:
   https://api.newday.neyronikol.ru/docs