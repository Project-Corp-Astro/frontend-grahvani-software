# ============================================================
# Grahvani Frontend - Next.js Standalone Dockerfile
# ============================================================

# ---- Stage 1: Install dependencies ----
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (NEXT_PUBLIC_* are inlined at build time)
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_USER_SERVICE_URL
ARG NEXT_PUBLIC_CLIENT_SERVICE_URL

ENV NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
ENV NEXT_PUBLIC_USER_SERVICE_URL=${NEXT_PUBLIC_USER_SERVICE_URL}
ENV NEXT_PUBLIC_CLIENT_SERVICE_URL=${NEXT_PUBLIC_CLIENT_SERVICE_URL}

RUN npm run build

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV TZ=Asia/Kolkata

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 grahvani && \
    adduser --system --uid 1001 grahvani

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R grahvani:grahvani /app

USER grahvani

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
