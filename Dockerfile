# Build stage
FROM node:20.9.0-alpine AS builder

WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all config files
COPY svelte.config.js .
COPY vite.config.ts .
COPY tsconfig.json .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY components.json .
COPY eslint.config.js .

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Debug the build output
RUN ls -la build/

# Production stage
FROM node:20.9.0-alpine

WORKDIR /app

# Copy both package files
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy built application and assets
COPY --from=builder /app/build .
COPY --from=builder /app/src/lib/img ./client/assets/img

# Set up environment
ENV NODE_ENV=production
ENV PORT=8080
ENV ORIGIN=http://localhost:8080
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host

# Debug the final structure
RUN ls -la && echo "Client directory:" && ls -la client || true

EXPOSE 8080

CMD ["node", "index.js"]