-- Роли и авторизация для marathon_user
-- Выполни в Neon SQL Editor после создания основных таблиц.

-- Роль: participant (по умолчанию) или admin
ALTER TABLE marathon_user
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'participant'
    CHECK (role IN ('participant', 'admin'));

-- Токен участника (опционально): генерируем при первом обращении, проверяем в запросах
ALTER TABLE marathon_user
  ADD COLUMN IF NOT EXISTS auth_token TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_marathon_user_auth_token
  ON marathon_user(auth_token) WHERE auth_token IS NOT NULL;
