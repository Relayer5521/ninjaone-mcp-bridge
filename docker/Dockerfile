# =============================================================================
# NinjaOne MCP Bridge - Dockerfile
# Multi-stage build for production
# =============================================================================

FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# =============================================================================
# Production stage
# =============================================================================
FROM node:18-alpine

LABEL maintainer="rr@canopymsp.com"
LABEL version="1.3.0"
LABEL description="NinjaOne MCP Bridge Server"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R node:node /app

# Run as non-root user
USER node

# Environment defaults
ENV NODE_ENV=production
ENV PORT=8102

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8102/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

EXPOSE 8102

# Default: HTTP transport for Docker
CMD ["node", "dist/index.js", "--transport", "http"]
