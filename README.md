# NewDay Project

Welcome to the NewDay project repository.

## Project Structure

```
NewDay/
├── README.md
├── DEPLOYMENT.md
├── PROJECT_SUMMARY.md
├── WEBINAR_LEAD_MAGNET_DETAILED.md
├── TECHNICAL_SPECIFICATION_WEBINAR.md
├── WEBINAR_CONTENT_STRUCTURE.md
├── WEBINAR_IMPLEMENTATION_PLAN.md
├── setup.sh
├── deploy.sh
├── server_deploy.sh
├── check_api.sh
├── start/
│   ├── project_brief.md
│   ├── requirements.md
│   ├── frontend_design.md
│   └── technical_specifications.md
├── docs/
│   └── project_structure.md
├── src/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── css/
│   │   ├── js/
│   │   └── assets/
│   └── backend/
├── tests/
└── assets/
```

## Getting Started

This project is in the initialization phase. The [start](file:///Users/lena/NewDay/start) directory contains initial documentation to guide development:

1. **Project Brief** - High-level overview and goals
2. **Requirements** - Functional and non-functional requirements
3. **Frontend Design** - UI/UX specifications and mockups
4. **Technical Specifications** - Architecture and technology choices

## Webinar Lead Magnet Implementation

The project has been updated to implement a flexible webinar lead magnet (formerly a 10-day anti-stress marathon) with the following components:

1. **Detailed Content Structure** - See [WEBINAR_CONTENT_STRUCTURE.md](file:///Users/lena/NewDay/WEBINAR_CONTENT_STRUCTURE.md)
2. **Technical Specification** - See [TECHNICAL_SPECIFICATION_WEBINAR.md](file:///Users/lena/NewDay/TECHNICAL_SPECIFICATION_WEBINAR.md)
3. **Implementation Plan** - See [WEBINAR_IMPLEMENTATION_PLAN.md](file:///Users/lena/NewDay/WEBINAR_IMPLEMENTATION_PLAN.md)
4. **Comprehensive Question Bank** - See [WEBINAR_LEAD_MAGNET_DETAILED.md](file:///Users/lena/NewDay/WEBINAR_LEAD_MAGNET_DETAILED.md)

## Frontend Application

**Фронтенд (React, Vite, shadcn/ui)** — в **корне репо**:
- Лендинг, кабинет студента (каталог, мои курсы, **марафон 7 дней**, завершённые)
- Марафон 7 дней через n8n. Конфиг: `VITE_LEAD7_WEBHOOK_BASE`
- Админ: `/admin`
- Адаптивная вёрстка, mobile-first

Локально:
```bash
npm install
npm run dev
```
http://localhost:3000

**Vercel:** Root Directory оставь пустым, сборка из корня (см. [VERCEL_SETUP.md](VERCEL_SETUP.md)).

Старый SPA и бэкенд — в `_old_src/frontend/` и `_old_src/backend/`.

## Deployment

The project includes deployment scripts for both local development and server deployment:

1. **Local Deployment** - See [deploy.sh](file:///Users/lena/NewDay/deploy.sh)
2. **Server Deployment** - See [server_deploy.sh](file:///Users/lena/NewDay/server_deploy.sh)
3. **Deployment Documentation** - See [DEPLOYMENT.md](file:///Users/lena/NewDay/DEPLOYMENT.md)

## Next Steps

1. Review documents in the [start](file:///Users/lena/NewDay/start) folder
2. Confirm or modify the proposed structure
3. Begin development in the [src](file:///Users/lena/NewDay/src) directory
4. Implement the webinar lead magnet according to the technical specifications