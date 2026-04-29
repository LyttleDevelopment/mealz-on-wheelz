# Use an official Node.js runtime as a parent image
FROM node:24.11.1

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY package*.json ./
COPY tsconfig.json ./
COPY app ./app
COPY public ./public
COPY next.config.* ./
COPY site.config.* ./
COPY eslint.config.* ./
COPY packages/design-framework ./packages/design-framework

# Install dependencies using npm ci
RUN npm ci

# Build the application
RUN npm run docker:setup

# Command to run your application
CMD ["npm", "start"]

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
