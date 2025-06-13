# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy application code
COPY . .

# For local development, run as root to avoid permission issues
# In production, we use a proper non-root user (see Dockerfile.prod)

# Expose port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 