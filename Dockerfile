
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

# Copia apenas arquivos necessários para produção
COPY package*.json ./
COPY .env ./
COPY dist ./dist
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Instala todas as dependências (inclui dotenv)
RUN npm install --no-audit --no-fund

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
