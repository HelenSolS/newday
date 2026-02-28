# Подключение фронта к n8n (7-дневный марафон)

## 1. URL webhook’ов в n8n

В n8n открой каждый из трёх воркфлоу Lead7 → нода **Webhook** → скопируй **Production URL**.

У тебя:
- **Сохранить прогресс:** `https://n8n.neyronikol.ru/webhook-test/lead7/progress` (POST)
- **Получить прогресс:** `https://n8n.neyronikol.ru/webhook-test/lead7/progress` (GET)
- **Завершить и промокод:** `https://n8n.neyronikol.ru/webhook-test/lead7/finish` (POST)

Если у тебя другой домен — пропиши его в `src/frontend/config.js` в `LEAD7_WEBHOOK_BASE`.

## 2. Конфиг фронта

В `config.js` уже задано:
```js
LEAD7_WEBHOOK_BASE: "https://n8n.neyronikol.ru/webhook"
```
Измени на свой URL, если n8n доступен по другому адресу.

## 3. Вызовы с фронта

Базовый URL: `window.APP_CONFIG.LEAD7_WEBHOOK_BASE` (например `https://n8n.neyronikol.ru/webhook`).

### Сохранить прогресс дня
```js
const base = window.APP_CONFIG.LEAD7_WEBHOOK_BASE;
const externalId = localStorage.getItem('lead7_user_id') || crypto.randomUUID();
localStorage.setItem('lead7_user_id', externalId);

const res = await fetch(`${base}/lead7/progress`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    external_id: externalId,
    channel: 'web',
    day_number: 1,
    is_test_passed: true,
    answers: [
      { question_number: 1, selected_option: 2, is_correct: true },
      { question_number: 2, selected_option: 1, is_correct: true },
      { question_number: 3, selected_option: 3, is_correct: false }
    ]
  })
});
const data = await res.json(); // { ok: true, user_id: ... }
```

### Получить прогресс
```js
const externalId = localStorage.getItem('lead7_user_id');
const res = await fetch(`${base}/lead7/progress?external_id=${encodeURIComponent(externalId)}`);
const data = await res.json(); // { days: [ { day_number, is_test_passed, completed_at }, ... ] }
```

### Запросить промокод (после 7 дней)
```js
const res = await fetch(`${base}/lead7/finish`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ external_id: localStorage.getItem('lead7_user_id') })
});
const data = await res.json();
// Успех: { ok: true, promo_code: "MARATHON10-XXXX", discount_percent: 10 }
// Не все дни: { ok: false, error: "not_all_days_completed" }
```

## 4. Контент дней

Тексты 7 дней лежат в Neon в таблице `lead7_day_content`. Чтобы показывать их на фронте, можно:
- добавить в n8n воркфлоу **GET /lead7/content** (или `/lead7/content?day=1` … `day=7`), который читает из БД и отдаёт JSON;
- либо загрузить контент из `docs/migrations/RUN_IN_NEON_ONE_FILE.sql` и хранить его статически во фронте.

## 5. Дальше

- На странице «Марафон»: список дней 1–7, по клику — контент дня и кнопка «День пройден» (вызов save progress).
- Когда все 7 дней с `is_test_passed: true` — кнопка «Получить промокод» (вызов finish) и показ кода.
