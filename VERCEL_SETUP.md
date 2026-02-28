# Настройка деплоя на Vercel

Чтобы сборка проходила успешно:

1. Открой проект в Vercel → **Settings** → **General**.
2. В поле **Root Directory** укажи **`frontend`** (без слэша).
3. Нажми **Edit** → введи `frontend` → **Save**.
4. Сделай **Redeploy** (Deployments → три точки у последнего деплоя → Redeploy).

Корневой `vercel.json` удалён специально: команды с `cd frontend` вызывали ошибку, если Vercel запускал сборку не из корня репо. При **Root Directory = frontend** сборка идёт сразу из папки приложения, без `cd`.
