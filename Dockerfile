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

# 6. FORCE EXECUTE PERMISSIONS - This is the new line to fix the weird issue.
RUN chmod -R +x /app/node_modules/.bin

# 7. Copy the rest of your application code.
COPY . .

# 8. Build your TypeScript project.
RUN npm run build

# 9. Prune dev dependencies AFTER the build is successful to shrink the final image.
RUN npm prune --production

# 10. Switch back to the non-root user for security.
USER pptruser

# 11. Expose the application port.
EXPOSE 3000

# 12. Define the command to start your app.
CMD [ "npm", "start" ]