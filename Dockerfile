FROM node:22-alpine

WORKDIR /app

# Copy server package files and install production dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server code and database initialization SQL
COPY server/index.js ./
COPY server/db.sql ./

# Expose port
EXPOSE 5000

CMD ["node", "index.js"]
