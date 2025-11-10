# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy environment config generation script
COPY generate-env-config.sh /generate-env-config.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make scripts executable
RUN chmod +x /generate-env-config.sh /docker-entrypoint.sh

EXPOSE 80

# Use custom entrypoint to inject environment variables at runtime
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]