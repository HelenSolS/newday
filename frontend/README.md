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

В Vercel укажи:
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

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
