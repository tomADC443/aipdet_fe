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

# Copy source code and static files
COPY src ./src
COPY static ./static

# Build the application
RUN npm run build

# Production stage
FROM node:20.9.0-alpine

WORKDIR /app

# Copy both package files
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/build .

# Copy static files
COPY --from=builder /app/static ./static

# Expose the default SvelteKit port
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]