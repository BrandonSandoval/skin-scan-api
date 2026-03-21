# 📝 Setup & Installation Guide

**Version:** 1.0  
**Last Updated:** March 2024

Comprehensive setup guide for all platforms (macOS, Linux, Windows).

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [macOS Installation](#macos-installation)
4. [Linux Installation](#linux-installation)
5. [Windows Installation](#windows-installation)
6. [Database Setup](#database-setup)
7. [Environment Configuration](#environment-configuration)
8. [Starting Development Servers](#starting-development-servers)
9. [Troubleshooting](#troubleshooting)
10. [Verification Steps](#verification-steps)

---

## System Requirements

### Minimum Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.0+ | Backend API |
| Python | 3.8+ | ML Model Inference |
| MongoDB | 4.4+ | Database |
| npm | 9.0+ | Package manager |
| Git | 2.25+ | Version control |
| RAM | 4GB | Running all services |
| Disk | 2GB | Project + dependencies |

### Optional But Recommended

| Component | Purpose |
|-----------|---------|
| Docker | Containerized environment |
| Docker Compose | Multi-container orchestration |
| MongoDB Compass | MongoDB GUI client |
| VS Code | Code editor |
| Postman | API testing |
| Git GUI | Visual Git client |

---

## Initial Setup

### 1. Clone Repository

**HTTPS (Simpler):**
```bash
git clone https://github.com/YOUR_USERNAME/skin-scan-api.git
cd skin-scan-api
```

**SSH (If configured):**
```bash
git clone git@github.com:YOUR_USERNAME/skin-scan-api.git
cd skin-scan-api
```

### 2. Create .env File

From project root:
```bash
# Copy template
cp .env.example .env

# Or manually create (see Environment Configuration section)
```

### 3. Verify Git Setup

```bash
# Check current branch
git status
# Should show "On branch main"

# Check remotes
git remote -v
# Should show origin pointing to your fork
# And upstream (optional) pointing to original repo
```

---

## macOS Installation

### Step 1: Install Prerequisites

**Using Homebrew (Recommended):**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Install Python
brew install python@3.11

# Install MongoDB (Community Edition)
brew tap mongodb/brew
brew install mongodb-community

# Or use MongoDB Atlas (cloud) instead (recommended)
```

**Verify Installations:**
```bash
node --version      # v18.x or higher
npm --version       # 9.x or higher
python3 --version   # 3.8 or higher
mongo --version     # If installed locally
```

### Step 2: Backend Setup

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Node dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Verify installations
npm list express
pip list | grep torch
```

### Step 3: Frontend Setup

```bash
cd ../frontend/my-app

# Install dependencies
npm install

# Install specific versions if needed
npm install --save next@15.5.2 react@19.1.0
```

### Step 4: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
brew services start mongodb-community

# Verify running
brew services list | grep mongodb

# Connect to MongoDB
mongosh

# In MongoDB shell
show dbs  # Should list default databases
exit
```

**Option B: MongoDB Atlas (Cloud) - Recommended**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (AWS, N. Virginia)
4. Get connection string
5. Save in `.env` as `MONGO_URI`

---

## Linux Installation

### Ubuntu/Debian

#### Step 1: Install Prerequisites

```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Install MongoDB (Community Edition)
sudo apt-get install -y gnupg curl

curl https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on reboot
```

#### Step 2: Backend Setup

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Node dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

#### Step 3: Frontend Setup

```bash
cd ../frontend/my-app
npm install
```

#### Step 4: MongoDB Verification

```bash
# Check MongoDB status
sudo systemctl status mongod

# Connect
mongosh

# In MongoDB shell
show dbs
exit
```

### Fedora/CentOS/RHEL

```bash
# Install Node.js
sudo dnf module enable nodejs:18
sudo dnf install -y nodejs npm

# Install Python
sudo dnf install -y python3 python3-pip python3-venv

# Install MongoDB
# Follow: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/

# Rest of setup follows Ubuntu steps above
```

---

## Windows Installation

### Step 1: Install Prerequisites

**Method A: Using Installers**

1. **Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Run installer (.msi)
   - Choose "Add to PATH"
   - Click Install

2. **Python**
   - Download from [python.org](https://www.python.org/)
   - Run installer (.exe)
   - ✅ Check "Add Python to PATH"
   - Click Install

3. **MongoDB**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Run installer
   - Choose "Run as Windows Service"
   - Finish installation

4. **Git** (if not already installed)
   - Download from [git-scm.com](https://git-scm.com/)
   - Run installer
   - Use default settings

**Method B: Using Chocolatey (Easier)**
```powershell
# Install Chocolatey first (as Administrator)
# From: https://chocolatey.org/install

# Then install packages
choco install nodejs python mongodb-community git -y
```

### Step 2: Verify Installations

Open PowerShell and check:
```powershell
node --version
npm --version
python --version
mongosh --version
git --version
```

### Step 3: Backend Setup

```powershell
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get an execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate again:
.\venv\Scripts\Activate.ps1

# Install Node dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Step 4: Frontend Setup

```powershell
cd ..\frontend\my-app
npm install
```

### Step 5: MongoDB Setup

**If using local MongoDB:**
```powershell
# MongoDB service should auto-start after installation
# Verify:
Get-Service -Name MongoDB

# Or start manually:
net start MongoDB

# Connect
mongosh
```

**Using MongoDB Atlas (Recommended):**
- Follow cloud setup in macOS section

---

## Database Setup

### Local MongoDB

**Create Indexes (Required for Performance):**
```bash
# Connect to MongoDB
mongosh

# Create database
use skin-scan

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.history.createIndex({ userId: 1, createdAt: -1 })
db.feedback.createIndex({ userId: 1, predictionId: 1 })

# Verify indexes
db.users.getIndexes()

# Exit
exit
```

### MongoDB Atlas (Cloud - Recommended)

**Setup Steps:**

1. **Create Cluster**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Build a Cluster"
   - Choose Free tier (M0)
   - Select region (closest to you)
   - Click "Create Cluster"

2. **Create Database User**
   - In Atlas dashboard, go to "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `skinscan_user`
   - Password: Strong random password
   - Built-in roles: "Read and write to any database"
   - Click "Add User"

3. **Whitelist Your IP**
   - Go to "Security" → "Network Access"
   - Click "Add IP Address"
   - For development: Click "Add My Current IP Address"
   - For production: Add your server IP
   - Click "Confirm"

4. **Get Connection String**
   - Click "Connect" on cluster overview
   - Choose "Drivers" method
   - Copy connection string
   - Example: `mongodb+srv://skinscan_user:PASSWORD@cluster.mongodb.net/skin-scan?retryWrites=true&w=majority`

5. **Configure in .env**
   ```bash
   MONGO_URI=mongodb+srv://skinscan_user:PASSWORD@cluster.mongodb.net/skin-scan?retryWrites=true&w=majority
   ```

6. **Create Indexes (Optional in Atlas)**
   ```bash
   # Through MongoDB Compass or Atlas UI
   # Atlas → Collections → Select collection → Indexes tab
   # Or run the mongosh commands above
   ```

---

## Environment Configuration

### Create .env File

**From project root, copy template:**
```bash
cp .env.example .env
```

**Or manually create `.env` with these values:**

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/skin-scan
# OR for Atlas:
# MONGO_URI=mongodb+srv://skinscan_user:PASSWORD@cluster.mongodb.net/skin-scan?retryWrites=true&w=majority

# JWT (Authentication)
JWT_SECRET=your_very_secure_secret_key_min_32_characters_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
JWT_EXPIRATION=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug

# CORS (Cross-Origin)
CORS_ORIGINS=http://localhost:3000

# Optional: Python Model Path
# PYTHON_MODEL_PATH=./model/best_model.pt
```

### Frontend .env.local

**Navigate to frontend directory:**
```bash
cd frontend/my-app
cp .env.example .env.local
```

**Or create `.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=SkinScan
```

### Environment Variables Explained

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `development` or `production` | Controls logging level, error details |
| `PORT` | `5000` | Express server port |
| `MONGO_URI` | MongoDB connection string | Database connection |
| `JWT_SECRET` | Random 32+ char string | Token signing key (KEEP SECRET!) |
| `JWT_EXPIRATION` | `7d`, `24h`, `30d` | How long tokens are valid |
| `LOG_LEVEL` | `debug`, `info`, `warn`, `error` | Logging verbosity |
| `CORS_ORIGINS` | URLs separated by comma | Allowed frontend origins |

---

## Starting Development Servers

### Full Setup (All Three Servers)

**Terminal 1 - Backend API:**
```bash
cd backend

# Activate Python environment
source venv/bin/activate  # macOS/Linux
# OR
.\venv\Scripts\Activate.ps1  # Windows

# Start server
npm run start

# Should show:
# SkinScan running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/my-app

# Start Next.js dev server
npm run dev

# Should show:
# > Local: http://localhost:3000
```

**Terminal 3 - Optional: Test Requests**
```bash
# Test API health
curl http://localhost:5000/healthz

# Response should be:
# {"status":"OK"}
```

### Quick Start Script (Optional)

**Create `start-dev.sh` (macOS/Linux):**
```bash
#!/bin/bash
set -e

echo "Starting SkinScan development servers..."

# Backend
(cd backend && source venv/bin/activate && npm run start) &
BACKEND_PID=$!

# Frontend
(cd frontend/my-app && npm run dev) &
FRONTEND_PID=$!

echo "Backend (PID: $BACKEND_PID) starting on http://localhost:5000"
echo "Frontend (PID: $FRONTEND_PID) starting on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
```

**Usage:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## Troubleshooting

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# macOS/Linux: Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
Stop-Process -Id <PID> -Force

# OR change port in .env
PORT=5001
```

### Python Virtual Environment Not Activating

**Problem:** `source: command not found` (Windows)

**Solution:**
```bash
# Windows uses different activation script:
.\venv\Scripts\Activate.ps1

# If PowerShell execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### MongoDB Connection Failed

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution 1: Start local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux (Ubuntu)
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Solution 2: Use MongoDB Atlas**
```bash
# Update MONGO_URI in .env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/skin-scan
```

### Python Module Not Found

**Problem:** `ModuleNotFoundError: No module named 'torch'`

**Solution:**
```bash
# Make sure venv is activated
source venv/bin/activate  # macOS/Linux
.\venv\Scripts\Activate.ps1  # Windows

# Reinstall dependencies
pip install -r requirements.txt

# Verify
python -c "import torch; print(torch.__version__)"
```

### npm install Fails

**Problem:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install

# OR use legacy peer deps
npm install --legacy-peer-deps
```

### Next.js Port Conflict

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000  # macOS/Linux
kill -9 <PID>

# OR run on different port
npm run dev -- -p 3001
```

---

## Verification Steps

### Quick Verification After Setup

**1. Backend Health Check**
```bash
curl http://localhost:5000/healthz

# Expected response:
# {"status":"OK"}
```

**2. Database Connection**
```bash
# Connect to MongoDB
mongosh

# Run commands
use skin-scan
db.users.find()  # Should return empty array []
exit
```

**3. Frontend Loading**
Open browser: `http://localhost:3000`
- Should see landing page
- No errors in console (F12)

**4. Authentication Flow**
```bash
TOKEN=$(curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# Should get a JWT token (long string starting with eyJ)
```

**5. Test Complete Workflow**
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Password123"}'

# 2. Login
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Password123"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# 3. Get Dashboard
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Should return user statistics
```

---

## Next Steps

After successful setup:

1. **Read Documentation**
   - [README.md](../README.md) - Project overview
   - [docs/API.md](API.md) - API endpoints
   - [docs/ARCHITECTURE.md](ARCHITECTURE.md) - System design

2. **Try the API**
   - Use [Example Requests](API.md#example-requests) in API.md
   - Test with Postman or cURL
   - Upload sample image and get prediction

3. **Start Development**
   - Create feature branch: `git checkout -b feature/your-feature`
   - Make changes
   - Run tests: `npm test`
   - Submit pull request

4. **Deploy**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

---

**Version:** 1.0  
**Last Updated:** March 2024  
**Status:** Complete ✅

For additional help, check [Troubleshooting](#troubleshooting) or open an issue on GitHub!
