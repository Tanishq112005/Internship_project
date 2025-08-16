# 1. Use the official Puppeteer image from Google's Chrome Team.
# It includes Node.js, Chrome, and all necessary dependencies.
FROM ghcr.io/puppeteer/puppeteer:21.5.0

# 2. Switch to the root user to install project dependencies.
# The base image defaults to a non-root 'pptruser'.
USER root

# 3. Set the working directory.
WORKDIR /app

# The base image already has Puppeteer installed globally.
# The ENV var below prevents npm from trying to re-download Chromium.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 4. Copy your package files and install your app's dependencies.
COPY package*.json ./
# Use --ignore-scripts to prevent any potential post-install issues
# and ensure a clean install of only your listed dependencies.
RUN npm install --ignore-scripts

# 5. Copy the rest of your application code.
COPY . .

# 6. Build your TypeScript project.
RUN npm run build

# 7. (Optional but recommended) Prune dev dependencies.
RUN npm prune --production

# 8. Switch back to the non-root user for security.
USER pptruser

# 9. Expose the application port.
EXPOSE 3000

# 10. Define the command to start your app.
CMD [ "npm", "start" ]