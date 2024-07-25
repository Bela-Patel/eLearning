# Dockerfile for NodeJS backend

# Use the official Node.js image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Install MongoDB
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    mkdir -p /data/db

# Copy MongoDB initialization script
COPY mongo-init.js /docker-entrypoint-initdb.d/

# Expose ports
EXPOSE 5000 27017


# Start MongoDB and Node.js server
CMD mongod --fork --logpath /var/log/mongodb.log && node server.js
