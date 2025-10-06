#!/bin/sh
set -e

# Wait for DB to be ready using pg_isready if available
wait_for_db() {
	if command -v pg_isready >/dev/null 2>&1; then
		echo "Waiting for Postgres to be ready..."
		retries=0
		until pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-postgres}" >/dev/null 2>&1; do
			retries=$((retries+1))
			if [ $retries -ge 30 ]; then
				echo "Postgres did not become ready in time" >&2
				return 1
			fi
			sleep 1
		done
		echo "Postgres is ready"
	else
		echo "pg_isready not available; skipping DB ready check"
	fi
}

wait_for_db || true

# Decide migration strategy:
# - If compiled migrations exist in dist, run node script
# - Else, if ts-node is available (dev image), run ts-node script

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
exec "$@"
