# Build stage
FROM node:23-alpine AS builder

WORKDIR /app

# Install dependencies for sharp
RUN apk add --no-cache vips-dev

# Copy package files
COPY package*.json ./
COPY apps/cms/package*.json ./apps/cms/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/cms ./apps/cms

# Build the application
WORKDIR /app/apps/cms
RUN npm run build

# Production stage
FROM node:23-alpine AS runner

WORKDIR /app

# Install dumb-init and dependencies for sharp
RUN apk add --no-cache dumb-init vips-dev

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files and install production dependencies
COPY apps/cms/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/static ./.next/static

# Create media directory for uploads
RUN mkdir -p ./media && chown nextjs:nodejs ./media

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]