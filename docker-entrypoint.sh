#!/bin/sh
set -e

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
