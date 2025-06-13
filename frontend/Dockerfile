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

# Create user with same UID as host user (1000 is common on Ubuntu)
ARG USER_ID=1000
ARG GROUP_ID=1000

# Use existing user/group if they match the IDs, otherwise create new ones
RUN if getent group $GROUP_ID > /dev/null 2>&1; then \
      GROUP_NAME=$(getent group $GROUP_ID | cut -d: -f1); \
    else \
      addgroup -g $GROUP_ID -S nodejs && GROUP_NAME=nodejs; \
    fi && \
    if getent passwd $USER_ID > /dev/null 2>&1; then \
      USER_NAME=$(getent passwd $USER_ID | cut -d: -f1); \
    else \
      adduser -S reactuser -u $USER_ID -G $GROUP_NAME && USER_NAME=reactuser; \
    fi

# Change ownership of the app directory  
RUN chown -R $USER_ID:$GROUP_ID /app

USER $USER_ID:$GROUP_ID

# Expose port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 