# Build Stage
FROM node:20 AS build

WORKDIR /app 

COPY package.json package-lock.json ./


RUN npm install

COPY . .



# Production Stage
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]