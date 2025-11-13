# ========================================
# ROOTLY SSR FRONTEND - DOCKERFILE
# ========================================

# Use the official Node.js 18 image as base
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm ci --no-audit --no-fund --prefer-online

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm ci --no-audit --no-fund --prefer-online
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Instalar openssl para generar certificados
RUN apk add --no-cache openssl

# Copiar node_modules desde builder (incluye todas las dependencias necesarias)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copiar archivos necesarios desde builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts

# Copiar nuestro server.js personalizado
COPY --chown=nextjs:nodejs server.js ./

# Crear directorio de certificados y generar certificados SSL
RUN mkdir -p ./certs && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout ./certs/localhost.key \
      -out ./certs/localhost.crt \
      -subj "/C=CO/ST=Bogota/L=Bogota/O=Mi Laboratorio/OU=Dev/CN=localhost" && \
    chown nextjs:nodejs ./certs/localhost.key ./certs/localhost.crt && \
    chmod 600 ./certs/localhost.key && \
    chmod 644 ./certs/localhost.crt

USER nextjs

EXPOSE 3443

ENV PORT=3443
ENV HOSTNAME="0.0.0.0"

# Start the application using server.js
CMD ["node", "server.js"]
