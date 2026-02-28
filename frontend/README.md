# NewDay Frontend (React + Vite + shadcn/ui)

Фронтенд платформы NewDay на базе [marathon-craft](https://github.com/HelenSolS/marathon-craft): React, TypeScript, Vite, Tailwind, shadcn/ui.

## Запуск

```bash
npm i
npm run dev
```

Откроется http://localhost:3000

## Сборка для Vercel

```bash
npm run build
```

**Важно для Vercel:** в настройках проекта (Settings → General) укажи **Root Directory: `frontend`**. Тогда сборка пойдёт из папки frontend, и не будет ошибки «frontend: No such file or directory».

Либо без Root Directory: Build Command — `cd frontend && npm run build`, Output — `frontend/dist`, Install — `cd frontend && npm install`.

## Переменные окружения

Создай `.env` в папке `frontend` (или задай в Vercel):

- `VITE_LEAD7_WEBHOOK_BASE` — базовый URL webhook'ов n8n (по умолчанию `https://n8n.neyronikol.ru/webhook`)
- `VITE_API_BASE` — URL бэкенда FastAPI (для программ/курсов; опционально)
- `VITE_MOCK_MODE` — `true` для демо без бэкенда

## Структура

- **/** — лендинг (Landing)
- **/student** — кабинет: Каталог, Мои курсы, **Марафон 7 дней** (n8n), Завершённые
- **/admin** — панель администратора (конструктор курсов)

Марафон 7 дней ходит в n8n по `LEAD7_WEBHOOK_BASE` (progress, finish).
