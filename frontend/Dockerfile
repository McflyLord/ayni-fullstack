# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# En producción el frontend llama a /api/v1 (mismo origen).
# nginx se encarga de redirigir /api/ al backend de Railway.
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine

# La imagen oficial de nginx procesa /etc/nginx/templates/*.template con envsubst.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

# Dirección interna o pública del backend en Railway.
ENV BACKEND_URL=http://backend.railway.internal:8080
ENV PORT=8080

# Solo sustituir estas variables; el resto ($host, $uri, etc.) son de nginx.
ENV NGINX_ENVSUBST_FILTER="PORT|BACKEND_URL"

EXPOSE 8080
