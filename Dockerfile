# Development stage
FROM node:18 AS local
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5174
CMD ["npm", "run", "dev", "--", "--host", "--port", "5174"]

# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve stage (optional: can use nginx or just for development)
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 5173