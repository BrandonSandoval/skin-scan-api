# Use Node.js base with Debian to support Python
FROM node:20

# Install Python & pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Python dependencies
COPY model/requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt

# Create app directory
WORKDIR /app

# Copy your backend code
COPY backend/ .  

# Install Node dependencies
RUN npm install

# Expose port
EXPOSE 10000

# Run server
CMD ["node", "index.js"]
