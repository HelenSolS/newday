-- Базовые таблицы для 7-дневного марафона (n8n + Neon).
-- Выполни первой в Neon SQL Editor.

-- Участники (идентификатор с фронта/бота)
CREATE TABLE IF NOT EXISTS marathon_user (
  id SERIAL PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  channel TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Прогресс по дням 1–7
CREATE TABLE IF NOT EXISTS lead7_day_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES marathon_user(id) ON DELETE CASCADE,
  day_number SMALLINT NOT NULL,
  is_test_passed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_lead7_progress_user ON lead7_day_progress(user_id);

-- Ответы на 3 вопроса теста дня (опционально)
CREATE TABLE IF NOT EXISTS lead7_answer (
  id SERIAL PRIMARY KEY,
  progress_id INTEGER NOT NULL REFERENCES lead7_day_progress(id) ON DELETE CASCADE,
  question_number SMALLINT NOT NULL,
  selected_option SMALLINT,
  is_correct BOOLEAN,
  UNIQUE(progress_id, question_number)
);

-- Промокоды 10% за прохождение 7 дней
CREATE TABLE IF NOT EXISTS promo_code (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent SMALLINT NOT NULL DEFAULT 10,
  for_product TEXT DEFAULT 'big_marathon',
  generated_for_user_id INTEGER REFERENCES marathon_user(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_code_user ON promo_code(generated_for_user_id);
