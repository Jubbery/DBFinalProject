# Use the official Node.js 20 image as a parent image
FROM node:20.8.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Set any environment variables
ENV NODE_ENV=production

# Server's port
EXPOSE 8000

# Command to run the app
CMD ["node", "server.js"]
