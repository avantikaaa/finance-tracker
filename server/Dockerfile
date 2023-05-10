# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Do tests
# CMD ["npm", "test"]

# Define the command to start the application
CMD ["node", "index.js"]

