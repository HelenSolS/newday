# Готовые воркфлоу n8n для 7-дневного марафона (Lead7)

Три JSON-файла можно **импортировать в n8n** и сразу использовать с твоей БД Neon.

## Как импортировать

1. Открой n8n → **Workflows** → меню (три точки) → **Import from File** (или **Import from URL**, если файлы выложишь куда-то).
2. Выбери по очереди:
   - `lead7-save-progress.json`
   - `lead7-get-progress.json`
   - `lead7-finish-promo.json`
3. После импорта в каждом воркфлоу открой ноды **Postgres** и в поле **Credential to connect with** выбери свой аккаунт (тот, что с Neon), например **Postgres account 2**.
4. Сохрани каждый воркфлоу и **активируй** (переключатель Active вкл.).

## Что делает каждый воркфлоу

| Файл | Путь webhook | Назначение |
|------|----------------------------|------------|
| `lead7-save-progress.json` | `POST .../lead7/progress` | Сохранить прогресс дня (external_id, day_number, is_test_passed). |
| `lead7-get-progress.json` | `GET .../lead7/progress?external_id=...` | Получить массив дней с флагами is_test_passed. |
| `lead7-finish-promo.json` | `POST .../lead7/finish` | Проверить 7 дней, выдать промокод 10% или ошибку. |

## URL после активации

В каждом воркфлоу открой ноду **Webhook** — там будет полный URL (например `https://n8n.neyronikol.ru/webhook/lead7/progress`). Эти URL нужны для фронта в конфиге `LEAD7_API_BASE` или отдельными переменными.

## Если credential не подхватился

Если после импорта ноды Postgres показывают ошибку «Credential not found»:
- Зайди в каждую ноду Postgres и заново выбери свой Postgres-аккаунт (Neon) в выпадающем списке.
- Имя в JSON: **Postgres account 2** — если у тебя другое, после импорта просто выбери нужный credential вручную.

## Шаблоны в n8n

В n8n в разделе **Templates** можно искать по словам **Webhook**, **Postgres**, **Respond to Webhook** — но эти три воркфлоу уже собраны под твою схему БД (marathon_user, lead7_day_progress, promo_code), поэтому удобнее импортировать готовые JSON из этой папки.
