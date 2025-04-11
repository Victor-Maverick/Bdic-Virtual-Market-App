# ---------- Stage 1: Builder ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy necessary files
COPY tsconfig.json .
COPY next.config.ts .
COPY postcss.config.mjs .

# Copy source code and public assets
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install curl (for healthcheck)
RUN apk add --no-cache curl

# Copy only what's needed for runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# If you need src files for API routes or Edge Functions
COPY --from=builder /app/src/app ./src/app

# Config files (needed by Next.js at runtime)
COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/postcss.config.mjs .

# Install production dependencies
RUN npm ci --only=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000 || exit 1

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
