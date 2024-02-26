# Use the official Node.js image as the base
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

WORKDIR /usr/src/app/src

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "start" ]
