#!/bin/sh
set -e

# Minimal container entrypoint: wait for DB, run migrations, then start the app.

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USERNAME:-postgres}"
DB_WAIT_RETRIES="${DB_WAIT_RETRIES:-30}"
DB_WAIT_SLEEP="${DB_WAIT_SLEEP:-2}"

if command -v pg_isready >/dev/null 2>&1; then
  echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT} (user=${DB_USER})..."
  i=0
  until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
    i=$((i+1))
    echo "Postgres not ready, attempt $i/${DB_WAIT_RETRIES}..."
    if [ "$i" -ge "$DB_WAIT_RETRIES" ]; then
      echo "Postgres did not become ready in time" >&2
      exit 1
    fi
    sleep "$DB_WAIT_SLEEP"
  done
  echo "Postgres is ready."
else
  echo "pg_isready not found — skipping DB wait. Ensure DB is reachable."
fi

echo "Running migrations if needed..."
if [ -d "dist/migrations" ] || [ -f "dist/migrations/" ]; then
  echo "Found compiled migrations. Running with Node..."
  node dist/scripts/runMigrations.js || true
else
  echo "No compiled migrations found. Trying ts-node script (dev image)..."
  if command -v ts-node >/dev/null 2>&1; then
    ts-node src/scripts/runMigrations.ts || true
  else
    echo "ts-node not available; skipping migrations."
  fi
fi

echo "Starting app"
exec "$@"
