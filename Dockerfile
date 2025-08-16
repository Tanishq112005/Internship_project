# Use a specific version of Node.js
FROM node:20-slim

# Install system dependencies needed for Chrome
# Grouping RUN commands reduces image layers
RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg \
    # Dependencies for Chrome
    libxshmfence-dev \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgtk-3-0 \
    libdrm2 \
    xdg-utils \
    --no-install-recommends && \
    # Download and install Google Chrome
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/keyrings/google-chrome.gpg && \
    echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    # Clean up to reduce image size
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files and install ALL dependencies (including dev for building)
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your TypeScript project
RUN npm run build

# Remove development dependencies to make the final image smaller
RUN npm prune --production

# Switch to a non-root user for security
USER node

# Expose the port your application will run on
EXPOSE 3000

# The command to start your application
CMD [ "npm", "start" ]