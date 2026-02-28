# Воркфлоу n8n: 7-дневный марафон (Lead Magnet)

База: Neon Postgres. Connection string хранится **только** в n8n → Credentials → Postgres (не коммитить в репозиторий).

---

## 1. Учётные данные в n8n

- **Credentials** → **Add credential** → **Postgres**.
- Вставь свой **Connection string** от Neon (тот что прислала).
- Имя, например: `Neon newday`.

---

## 2. Три эндпоинта (три воркфлоу или один с роутингом)

Удобнее сделать **три отдельных воркфлоу**, каждый с одним Webhook.

---

### 2.1. `POST /lead7/progress` — сохранить прогресс дня

**Назначение:** фронт шлёт: кто (external_id), какой день (day_number), прошёл ли тест (is_test_passed), при желании ответы на 3 вопроса.

**Вход (body JSON):**
```json
{
  "external_id": "uuid-или-email-или-telegram_id",
  "channel": "web",
  "day_number": 1,
  "is_test_passed": true,
  "answers": [
    { "question_number": 1, "selected_option": 2, "is_correct": true },
    { "question_number": 2, "selected_option": 1, "is_correct": true },
    { "question_number": 3, "selected_option": 3, "is_correct": true }
  ]
}
```

**Логика в n8n:**

1. **Webhook** — метод POST, путь `/lead7/progress`, body = JSON.
2. **Postgres** (credential = Neon):
   - Запрос 1: найти или создать пользователя.
     ```sql
     INSERT INTO marathon_user (external_id, channel)
     VALUES ($1, $2)
     ON CONFLICT (external_id) DO UPDATE SET external_id = EXCLUDED.external_id
     RETURNING id;
     ```
     Параметры: `$1` = `{{ $json.body.external_id }}`, `$2` = `{{ $json.body.channel || 'web' }}`.
   - В n8n часто делают два шага: сначала SELECT по external_id, если нет — INSERT. Либо один запрос с ON CONFLICT (требуется уникальность по external_id — она у нас есть).
3. **Postgres** — вставить/обновить прогресс дня:
   ```sql
   INSERT INTO lead7_day_progress (user_id, day_number, is_test_passed, completed_at)
   VALUES (
     (SELECT id FROM marathon_user WHERE external_id = $1),
     $2,
     $3,
     CASE WHEN $3 THEN now() ELSE NULL END
   )
   ON CONFLICT (user_id, day_number) DO UPDATE SET
     is_test_passed = EXCLUDED.is_test_passed,
     completed_at = EXCLUDED.completed_at;
   ```
   Параметры: `$1` = external_id, `$2` = day_number, `$3` = is_test_passed.
4. Если в body есть `answers` — цикл по ним и для каждого:
   ```sql
   INSERT INTO lead7_answer (progress_id, question_number, selected_option, is_correct)
   VALUES (
     (SELECT id FROM lead7_day_progress WHERE user_id = (SELECT id FROM marathon_user WHERE external_id = $1) AND day_number = $2),
     $3, $4, $5
   )
   ON CONFLICT (progress_id, question_number) DO UPDATE SET selected_option = EXCLUDED.selected_option, is_correct = EXCLUDED.is_correct;
   ```
   ($1=external_id, $2=day_number, $3=question_number, $4=selected_option, $5=is_correct)
5. **Respond to Webhook** — вернуть `{ "ok": true }` или `{ "ok": true, "user_id": ... }`.

---

### 2.2. `GET /lead7/progress` — получить прогресс

**Назначение:** фронт передаёт `external_id` (query или header), получает список дней и статус прохождения.

**Вход:** query-параметр `external_id` или заголовок, например `X-User-Id`.

**Логика в n8n:**

1. **Webhook** — метод GET, путь `/lead7/progress`. Параметр: `external_id` (из query).
2. **Postgres**:
   ```sql
   SELECT p.day_number, p.is_test_passed, p.completed_at
   FROM lead7_day_progress p
   JOIN marathon_user u ON u.id = p.user_id
   WHERE u.external_id = $1
   ORDER BY p.day_number;
   ```
   Параметр: `$1` = `{{ $json.query.external_id }}`.
3. **Respond to Webhook** — вернуть JSON, например:
   ```json
   { "days": [ { "day_number": 1, "is_test_passed": true, "completed_at": "..." }, ... ] }
   ```
   Если пользователя нет — вернуть `{ "days": [] }`.

---

### 2.3. `POST /lead7/finish` — завершить 7 дней и выдать промокод

**Назначение:** фронт вызывает после того, как все 7 дней с `is_test_passed = true`. Проверяем в БД и, если ок, создаём промокод 10%.

**Вход (body JSON):**
```json
{
  "external_id": "uuid-или-email"
}
```

**Логика в n8n:**

1. **Webhook** — POST, путь `/lead7/finish`.
2. **Postgres** — проверить, что у пользователя все 7 дней пройдены:
   ```sql
   SELECT u.id
   FROM marathon_user u
   WHERE u.external_id = $1
     AND (SELECT COUNT(*) FROM lead7_day_progress p WHERE p.user_id = u.id AND p.is_test_passed = true) = 7;
   ```
   Параметр: `$1` = `{{ $json.body.external_id }}`.
3. Если запись не найдена — **Respond to Webhook** с кодом 400 и телом `{ "ok": false, "error": "not_all_days_completed" }`.
4. Если найдена — сгенерировать код (например, `MARATHON10-` + случайные символы) и:
   ```sql
   INSERT INTO promo_code (code, discount_percent, for_product, generated_for_user_id)
   VALUES ($1, 10, 'big_marathon', $2)
   RETURNING code, discount_percent;
   ```
   Параметры: `$1` = сгенерированный код, `$2` = user.id из шага 2.
5. **Respond to Webhook** — вернуть `{ "ok": true, "promo_code": "MARATHON10-XXXX", "discount_percent": 10 }`.

Чтобы один и тот же пользователь не получал два промокода, перед INSERT можно проверить:
```sql
SELECT id FROM promo_code WHERE generated_for_user_id = $1;
```
и если уже есть — вернуть существующий код вместо создания нового.

---

## 3. URL для фронта

После публикации воркфлоу n8n даст URL вида:
`https://твой-n8n.example.com/webhook/lead7/progress` (или с уникальным id).

В конфиге фронта нужно будет указать базовый URL webhook’ов, например:
- `LEAD7_API_BASE = 'https://твой-n8n.../webhook'`
и вызывать:
- `POST {{LEAD7_API_BASE}}/lead7/progress`
- `GET {{LEAD7_API_BASE}}/lead7/progress?external_id=...`
- `POST {{LEAD7_API_BASE}}/lead7/finish`

---

## 4. Кратко по таблицам (напоминание)

| Таблица               | Назначение |
|-----------------------|------------|
| `marathon_user`       | Участник (external_id = идентификатор с фронта/бота). |
| `lead7_day_progress`  | Прогресс по дням 1–7, флаг is_test_passed. |
| `lead7_answer`        | Ответы на 3 вопроса теста дня (опционально). |
| `promo_code`          | Выданные промокоды 10%, привязка к user. |

Connection string к Neon храни только в n8n Credentials.

---

## 5. Авторизация и роли

### 5.1. Роли в БД

В таблице `marathon_user` добавляем поле роли и опционально — токен, чтобы участник мог вызывать API только «от своего имени».

**Миграция (выполни в SQL Editor Neon):**

```sql
-- Роль: participant (по умолчанию) или admin
ALTER TABLE marathon_user
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'participant'
    CHECK (role IN ('participant', 'admin'));

-- Опционально: токен участника (генерируем при первом обращении, потом проверяем в запросах)
ALTER TABLE marathon_user
  ADD COLUMN IF NOT EXISTS auth_token TEXT UNIQUE;

-- Индекс для быстрой проверки по токену
CREATE INDEX IF NOT EXISTS idx_marathon_user_auth_token ON marathon_user(auth_token) WHERE auth_token IS NOT NULL;
```

- **participant** — участник марафона: может только читать/писать свой прогресс (по `external_id` или по `auth_token`).
- **admin** — админ: может смотреть списки участников, экспорт, ручная выдача промокодов. Роль выставляется вручную в БД или через отдельный защищённый сценарий.

### 5.2. Кто что может делать (авторизация)

| Действие | Кто | Как проверяем |
|----------|-----|----------------|
| Сохранить прогресс дня | Участник | Либо только `external_id` (MVP: доверяем фронту), либо заголовок `Authorization: Bearer <auth_token>` — в n8n ищем пользователя по токену и подставляем его `id`. |
| Получить свой прогресс | Участник | Только по своему `external_id` (или по `auth_token`). В n8n не отдаём прогресс по чужому `external_id`. |
| Запросить промокод (finish) | Участник | Тот же принцип: только свой `external_id` (или токен). |
| Список участников, экспорт, выдать промокод вручную | Admin | Отдельный webhook, доступный только при знании **секретного ключа админа** (например, заголовок `X-Admin-Key: <секрет>`). Либо проверка в БД: `external_id` принадлежит пользователю с `role = 'admin'`. |

Итого:
- **Участник** авторизуется тем, что знает свой идентификатор (`external_id` или выданный `auth_token`). Для MVP достаточно `external_id` (например, UUID в localStorage).
- **Админ** — отдельный секрет (API-ключ или пароль), хранится в n8n в переменных/credentials, не передаётся на фронт.

### 5.3. Вариант с токеном участника (усиленная авторизация)

Если хочешь, чтобы участник не мог подделать чужой `external_id`:

1. При первом запросе с `external_id` (например, POST /lead7/progress) в n8n:
   - находим или создаём пользователя;
   - если у пользователя нет `auth_token` — генерируем (например, случайная строка 32 символа), сохраняем в БД и в ответе возвращаем `{ "ok": true, "auth_token": "..." }`.
2. Фронт сохраняет `auth_token` в localStorage и дальше во всех запросах передаёт заголовок `Authorization: Bearer <auth_token>` (или query-параметр, если webhook не поддерживает заголовки).
3. В n8n в шаге Postgres сначала по `auth_token` находим `marathon_user.id`, дальше работаем только с ним. Запросы без валидного токена или с чужим `external_id` не принимаем.

Так участник может вызывать API только «от своего имени», даже если кто-то узнает формат запроса.

### 5.4. Защита webhook’ов от посторонних (общий секрет)

Чтобы на твои webhook’ы не мог дергать любой сайт в интернете:

- В n8n в настройках Webhook включи **Authentication** → **Header Auth** (или аналогичный вариант).
- Задай имя заголовка, например `X-API-Key`, и значение — длинный случайный секрет.
- Этот же секрет пропиши на фронте (в конфиге или в переменных окружения при сборке) и добавляй в каждый запрос к n8n. Тогда запросы без правильного ключа n8n будет отклонять.

Итог: **роли** храним в БД (`marathon_user.role`), **авторизацию участника** делаем через `external_id` (MVP) или через `auth_token`, **админа** — через отдельный секрет (header), **защиту от посторонних** — через общий API-ключ в заголовке webhook’а.
