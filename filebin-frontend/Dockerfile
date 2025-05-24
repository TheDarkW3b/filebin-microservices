# Stage 1: Build React app using Vite
FROM node:20 AS build-stage
WORKDIR /app

# Copy only package.json and package-lock.json initially for efficient caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application and build it using Vite
COPY . .
RUN npm run build

# Stage 2: Serve React app using Nginx
FROM nginx:alpine AS production-stage

# Copy the custom nginx.conf into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the 'dist' folder from the build stage to the Nginx container
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
