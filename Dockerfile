# --- Stage 1: Build the TypeScript application ---
    FROM node:20 as builder

    WORKDIR /app
    
    # Copy package files
    COPY package*.json ./
    
    # Install ALL dependencies, including devDependencies like typescript
    RUN npm install
    
    # Copy the rest of the source code
    COPY . .
    
    # Run the build command to compile TypeScript to JavaScript
    RUN npm run build
    
    
    # --- Stage 2: Create the final, smaller production image ---
    FROM node:20-slim
    
    # Install system dependencies needed for Chrome
    RUN apt-get update && \
        apt-get install -y \
        wget \
        # Dependencies for Chrome
        libnss3 libatk-bridge2.0-0 libcups2 libdrm2 libgbm-dev libxshmfence-dev \
        --no-install-recommends && \
        # Download and install Google Chrome
        wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
        apt-get install -y ./google-chrome-stable_current_amd64.deb && \
        # Clean up
        rm google-chrome-stable_current_amd64.deb && \
        rm -rf /var/lib/apt/lists/*
    
    # Set the path for puppeteer-core to find Chrome
    ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
    
    WORKDIR /app
    
    # Copy only the necessary production dependencies from the 'builder' stage
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package*.json ./
    
    # Copy the compiled JavaScript code from the 'builder' stage
    COPY --from=builder /app/dist ./dist
    
    # Switch to a non-root user for security
    USER node
    
    EXPOSE 3000
    
    # The command to start the application
    CMD [ "npm", "start" ]