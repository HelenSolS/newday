# Скрипты

## Заполнение БД Neon курсом 7 дней

Из корня репозитория:

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
python scripts/run_migrations_neon.py
```

Требуется: `pip install psycopg2-binary`

Скрипт по очереди выполняет:
- `000_initial_schema.sql` — таблицы marathon_user, lead7_day_progress, lead7_answer, promo_code
- `001_add_roles_and_auth.sql` — роли и auth_token для marathon_user
- `002_lead7_content.sql` — таблица lead7_day_content и контент всех 7 дней

Контент дней потом можно править через админку.
