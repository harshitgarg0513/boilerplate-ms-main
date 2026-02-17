# Use the official Node.js Alpine image with version 20.12
FROM node:20.12-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install global dependencies including NestJS CLI
RUN npm install -g @nestjs/cli@10.4.5 && npm install --production

# Copy the rest of the application files
COPY . .

# Build the applications
RUN npm run build:ms
RUN npm run build:apigateway