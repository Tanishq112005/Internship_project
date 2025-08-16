# 1. Use the official Puppeteer image from Google. It has Node, Chrome, and all dependencies.
FROM ghcr.io/puppeteer/puppeteer:21.5.0

# 2. Switch to the root user to install project dependencies.
USER root

# 3. Set the working directory.
WORKDIR /app

# The ENV var below prevents npm from trying to re-download Chromium.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 4. Copy your package files.
COPY package*.json ./

# 5. Install ALL dependencies (including devDependencies like typescript).
RUN npm install

# 6. Copy the rest of your application code.
COPY . .

# 7. Build your TypeScript project. Now `tsc` will be found.
RUN npm run build

# 8. Prune dev dependencies AFTER the build is successful to shrink the final image.
RUN npm prune --production

# 9. Switch back to the non-root user for security.
USER pptruser

# 10. Expose the application port.
EXPOSE 3000

# 11. Define the command to start your app.
CMD [ "npm", "start" ]