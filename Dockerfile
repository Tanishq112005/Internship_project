FROM node:20-slim

# 1. Install system dependencies for Chrome and wget
RUN apt-get update && \
    apt-get install -y \
    wget \
    # List of dependencies required by Chrome
    libnss3 libgtk-3-0 libxss1 libasound2 libatk-bridge2.0-0 libcups2 libdrm2 libgbm-dev libxshmfence-dev \
    --no-install-recommends && \
    # 2. Download the official Google Chrome .deb package
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    # 3. Install the package using apt. Apt will handle any missing sub-dependencies.
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    # 4. Clean up to reduce final image size
    rm google-chrome-stable_current_amd64.deb && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for Puppeteer
# This tells Puppeteer where to find the browser we just installed.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
# This is a crucial optimization: it prevents "npm install" from downloading
# its own copy of Chromium, saving hundreds of MBs and build time.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Copy package files and install ALL dependencies needed for the build
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your TypeScript project
RUN npm run build

# Remove development dependencies to make the final image smaller
RUN npm prune --production

# Switch to a non-root user for better security
USER node

EXPOSE 3000

# Command to start the application
CMD [ "npm", "start" ]