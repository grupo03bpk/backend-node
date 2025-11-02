#!/bin/sh
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

status() {
  if [ "$1" -eq 0 ]; then
    printf "%b\n" "${GREEN}✔ $2: OK${NC}"
  else
    printf "%b\n" "${RED}✖ $2: FALHOU${NC}"
    exit 1
  fi
}

echo "[1/5] Limpando containers antigos..."
docker compose down -v --remove-orphans >/dev/null 2>&1 || true
status $? "Docker cleanup"

echo "[2/5] Buildando projeto (npm run build)..."
npm run build
status $? "Build local"

echo "[3/5] Executando testes unitários (npm test)..."
npm test
status $? "Testes unitários"

echo "[4/5] Subindo stack Docker (docker compose up --build -d)..."
docker compose up --build -d
status $? "Docker Compose up"

echo "[5/5] Testando endpoint de health (curl http://localhost:3000/api/health)..."
sleep 5
curl -sf http://localhost:3000/api/health >/dev/null
status $? "Health check API"

printf "%b\n" "${GREEN}Validação completa: main está íntegra e pronta para merge!${NC}"

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

echo "Checking for compiled migrations..."
if [ -d "dist/migrations" ] || [ -f "dist/migrations/" ]; then
  echo "Found compiled migrations. Running migrations with node..."
  node dist/scripts/runMigrations.js || true
else
  echo "No compiled migrations found. Trying ts-node script (dev image)..."
  if command -v ts-node >/dev/null 2>&1; then
    ts-node src/scripts/runMigrations.ts || true
  else
    echo "ts-node not available; skipping migrations. Ensure migrations have been compiled or run manually."
  fi
fi

echo "Starting app"
# ensure the entrypoint replaces shell with the app process (preserves signals)
exec "$@"
