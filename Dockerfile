# Use Node.js base with Debian to support Python
FROM node:20

# Install Python and venv tools
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies in venv
COPY model/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

# Create app directory
WORKDIR /app

# Copy backend code
COPY backend/ .

# Install Node dependencies
RUN npm install

# Expose port
EXPOSE 10000

# Run the server
CMD ["node", "index.js"]
