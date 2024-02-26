FROM node:alpine

WORKDIR /app

# Copy your project files
COPY package.json ./

# Install your project dependencies
RUN npm install
RUN npm install -g @angular/cli

# Copy your application code
COPY . .



