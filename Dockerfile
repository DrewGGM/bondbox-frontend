# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

LABEL maintainer="BondBox Team"
LABEL description="BondBox Frontend - Production Build"

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with npm install (no ci)
RUN npm install --legacy-peer-deps --production=false

# Copy source code
COPY . .

# Build arguments
ARG VITE_API_GATEWAY_URL=http://localhost:8000
ARG VITE_APP_NAME=BondBox
ARG VITE_ENABLE_AI_FEATURES=true

ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_ENABLE_AI_FEATURES=$VITE_ENABLE_AI_FEATURES

# Build
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM nginx:1.25-alpine AS production

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]