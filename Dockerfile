# 1. Base Stage: Install pnpm
FROM node:22-alpine AS base
RUN npm i -g pnpm@10.34.9

# 2. Dependencies Stage: Install dependencies for caching
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY server/package.json server/pnpm-lock.yaml ./server/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd server && pnpm install --frozen-lockfile

# 3. Builder Stage: Build the frontend and Prisma
FROM base AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY . .

# Generate Prisma client
RUN cd server && pnpm exec prisma generate

# Declare build-time environment variables for Vite
ARG VITE_NEON_AUTH_URL
ENV VITE_NEON_AUTH_URL=$VITE_NEON_AUTH_URL

# Build Vite frontend and compile Express server to JS
RUN pnpm build && cd server && pnpm build && pnpm prune --prod

# 4. Runner Stage: The final, secure image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

ARG VITE_NEON_AUTH_URL
ENV VITE_NEON_AUTH_URL=$VITE_NEON_AUTH_URL

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S gymrunner -u 1001

# Copy only production artifacts (no pnpm, no tsx, no frontend node_modules)
COPY --chown=gymrunner:nodejs --from=builder /app/server/package.json ./server/
COPY --chown=gymrunner:nodejs --from=builder /app/server/node_modules ./server/node_modules
COPY --chown=gymrunner:nodejs --from=builder /app/dist ./dist
COPY --chown=gymrunner:nodejs --from=builder /app/server/dist ./server/dist

# Switch to non-root user
USER gymrunner

# Set the working directory to where the server runs from
WORKDIR /app/server

EXPOSE 3000

# Start compiled Express server directly with Node
CMD ["node", "dist/src/index.js"]
