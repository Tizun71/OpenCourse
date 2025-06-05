# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies (dev + prod)
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy package files and install only prod dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
