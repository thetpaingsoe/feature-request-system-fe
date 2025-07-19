# Development stage
FROM node:18 AS local
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]

# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve stage (optional: can use nginx or just for development)
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173