# ---- Build stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Copy only the files we need for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./   

EXPOSE 3000

CMD ["npm", "start"]
