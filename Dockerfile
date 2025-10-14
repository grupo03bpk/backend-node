FROM node:22-alpine

ARG INSTALL_DEV=false

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies: if INSTALL_DEV=true install devDependencies (for ts-node), otherwise install only production deps
RUN if [ "$INSTALL_DEV" = "true" ]; then npm ci; else npm ci --only=production; fi

# Copy source
COPY . .

# Make entrypoint executable
RUN chmod +x ./docker-entrypoint.sh || true

# Build project (compiles TS to dist)
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
