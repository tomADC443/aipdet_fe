# Build stage
FROM node:20.9.0-alpine AS builder

WORKDIR /app

# Copy package files
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

# Copy package.json and install production dependencies
COPY package.json .
RUN npm ci --production

# Copy built application from builder
COPY --from=builder /app/build .

# Expose the default SvelteKit port
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]