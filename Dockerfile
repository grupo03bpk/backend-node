FROM node:22-alpine

ARG INSTALL_DEV=false

WORKDIR /app

# Install runtime tools needed in entrypoint (pg_isready for DB wait)
RUN apk add --no-cache postgresql-client

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies: use npm install to honor overrides without requiring a lock update
RUN if [ "$INSTALL_DEV" = "true" ]; then \
  npm install --no-audit --no-fund; \
  else \
  npm install --omit=dev --no-audit --no-fund; \
  fi

# Copy source
COPY . .

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh || true

# Build project (compiles TS to dist)
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "start"]
