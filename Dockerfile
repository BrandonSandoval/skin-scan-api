# Use Node.js base with Debian to support Python
FROM node:20

# Install Python and venv tools
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY model/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

# --- Build frontend ---
WORKDIR /frontend
COPY frontend/my-app/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/my-app ./

# With Next.js 15 and `output: "export"` in next.config.js,
# `npm run build` will automatically generate /frontend/out
RUN npm run build

# --- Back to backend ---
WORKDIR /app
COPY backend/ ./        
COPY model/ ./model     

# Install backend dependencies
RUN npm install

# Copy frontend static export into backend public folder
RUN mkdir -p /app/public && cp -r /frontend/out/* /app/public/

# Expose backend port
EXPOSE 5000

# Run server
CMD ["node", "index.js"]
