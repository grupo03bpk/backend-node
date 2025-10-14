#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

function status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✔ $2: OK${NC}"
  else
    echo -e "${RED}✖ $2: FALHOU${NC}"
    exit 1
  fi
}

echo "[1/5] Limpando containers antigos..."
docker-compose down -v --remove-orphans > /dev/null 2>&1 || true

# Build

echo "[2/5] Buildando projeto (npm run build)..."
npm run build
status $? "Build local"

# Testes

echo "[3/5] Executando testes unitários (npm test)..."
npm test
status $? "Testes unitários"

# Docker Compose

echo "[4/5] Subindo stack Docker (docker-compose up --build -d)..."
docker-compose up --build -d
status $? "Docker Compose up"

# Health check

echo "[5/5] Testando endpoint de health (curl http://localhost:3000/api/health)..."
sleep 5
curl -sf http://localhost:3000/api/health > /dev/null
status $? "Health check API"

echo -e "\n${GREEN}Validação completa: main está íntegra e pronta para merge!${NC}"
