# Use the official Node.js image as the base
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy src folder
COPY . .

# Change to src directory
WORKDIR /usr/src/app/src

# Install app dependencies
RUN npm install

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches
CMD [ "npm", "run", "start" ]
