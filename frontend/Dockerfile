# Stage 1: Build Angular app
FROM node:18.19 as build

RUN mkdir usr/src/app
# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Display contents of the current directory (optional)
RUN ls -al

# Build the Angular app
RUN npm run build -- --output-path=dist/out --configuration production

# Stage 2: Serve Angular app with Nginx
FROM nginx:alpine

# Copy built Angular app from previous stage
COPY --from=build /usr/src/app/dist/out/browser /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
