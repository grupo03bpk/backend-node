#!/bin/sh
set -e

# Aguarda o banco ficar disponível
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Aguardando banco de dados..."
  sleep 2
done

# Executa as migrations
echo "Rodando migrations..."
npm run typeorm migration:run

# Executa o seed
echo "Executando seed..."
npm run seed

# Inicia a aplicação
echo "Iniciando app..."
npm start
