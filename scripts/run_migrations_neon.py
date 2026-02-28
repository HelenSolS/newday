#!/usr/bin/env python3
"""
Запуск миграций Neon (000, 001, 002) для заполнения БД курсом 7 дней.
Использование:
  export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
  python scripts/run_migrations_neon.py
Контент потом можно править через админку.
"""
import os
import sys

MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "migrations")
FILES = [
    "000_initial_schema.sql",
    "001_add_roles_and_auth.sql",
    "002_lead7_content.sql",
]


def main():
    url = os.environ.get("DATABASE_URL")
    if not url or "postgresql" not in url:
        print("Задай переменную DATABASE_URL (Neon connection string).", file=sys.stderr)
        print("Пример: export DATABASE_URL='postgresql://...?sslmode=require'", file=sys.stderr)
        sys.exit(1)

    try:
        import psycopg2
    except ImportError:
        print("Установи psycopg2-binary: pip install psycopg2-binary", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(url)
    conn.autocommit = True

    for name in FILES:
        path = os.path.join(MIGRATIONS_DIR, name)
        if not os.path.isfile(path):
            print(f"Файл не найден: {path}", file=sys.stderr)
            conn.close()
            sys.exit(1)
        with open(path, "r", encoding="utf-8") as f:
            sql = f.read()
        # Разбиваем по ; в конце строки (простые случаи)
        parts = [p.strip() for p in sql.split(";\n") if p.strip()]
        # Убираем строки-комментарии из каждого блока
        statements = []
        for part in parts:
            lines = [line for line in part.split("\n") if line.strip() and not line.strip().startswith("--")]
            stmt = "\n".join(lines)
            if stmt.strip():
                statements.append(stmt + ";")
        print(f"Выполняю {name} ({len(statements)} операций)...")
        try:
            with conn.cursor() as cur:
                for stmt in statements:
                    if stmt.strip() != ";":
                        cur.execute(stmt)
            print(f"  OK: {name}")
        except Exception as e:
            print(f"  Ошибка в {name}: {e}", file=sys.stderr)
            conn.close()
            sys.exit(1)

    conn.close()

    print("Миграции применены. Таблицы и контент 7 дней заполнены.")


if __name__ == "__main__":
    main()
