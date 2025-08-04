# Use Node.js 20 Alpine image for smaller size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to the nodejs user
USER nodejs

# Expose the port your app runs on
EXPOSE 8000

# Define the command to run your application
CMD ["npm", "start"]
