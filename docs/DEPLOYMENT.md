# 🚀 Deployment Guide

**Version:** 1.0  
**Last Updated:** March 2024

Complete guide for deploying SkinScan API to production environments.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Platform-Specific Guides](#platform-specific-guides)
5. [Database Migration](#database-migration)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] No console.log statements (use logger)
- [ ] No hardcoded secrets or credentials
- [ ] Code reviewed by at least one other person

### Documentation
- [ ] README.md updated with latest info
- [ ] API.md reflects all endpoints
- [ ] CHANGELOG.md has new version entry
- [ ] Deployment instructions are current
- [ ] Environment variables documented

### Dependencies
- [ ] No security vulnerabilities: `npm audit`
- [ ] All dependencies pinned to specific versions
- [ ] No deprecated packages
- [ ] Lock files committed (package-lock.json)

### Testing
- [ ] Unit tests cover new features
- [ ] Integration tests pass
- [ ] Manual testing on staging complete
- [ ] Load testing performed (if applicable)
- [ ] Error scenarios tested

### Infrastructure
- [ ] Database backups configured
- [ ] SSL/TLS certificate ready
- [ ] Environment variables prepared
- [ ] Monitoring/alerting configured
- [ ] Disaster recovery plan in place

---

## Environment Setup

### Production Environment Variables

Create `.env` (never commit to Git):

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skin-scan-prod?retryWrites=true&w=majority
# Important: Use separate prod database, not dev!

# Security
JWT_SECRET=use_a_very_long_random_string_at_least_32_chars_example_AbC123XyZ...
JWT_EXPIRATION=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info  # Less verbose than debug

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Model Path (Docker)
PYTHON_MODEL_PATH=/app/model/best_model.pt
```

### Database Setup

**Create MongoDB Cluster (MongoDB Atlas):**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create new project: "SkinScan"
4. Create cluster:
   - Provider: AWS/GCP (choose closest region)
   - Tier: M0 (free) for testing, M2+ for production
5. Configure Network Access:
   - IP Whitelist: Add production server IP or 0.0.0.0/0 (less secure)
6. Create database user:
   - Username: `skinscan_prod`
   - Password: Strong random password
7. Get connection string:
   - Choose "Connect Your Application"
   - Copy MongoDB URI
   - Replace `<password>` with actual password

**MongoDB URI Format:**
```
mongodb+srv://skinscan_prod:PASSWORD@cluster.mongodb.net/skin-scan-prod?retryWrites=true&w=majority
```

**Enable Production Features:**
```javascript
// In MongoDB Atlas Console

// 1. Enable automatic backups
Backups → Continuous Backup (M10+) or point-in-time restore

// 2. Create indexes for performance
db.users.createIndex({ email: 1 })
db.history.createIndex({ userId: 1, createdAt: -1 })
db.feedback.createIndex({ userId: 1, predictionId: 1 })

// 3. Enable audit logging (M10+)
// In Organization Settings → Audit Logs

// 4. Configure IP whitelist
Network Access → Add IP Address
// For flexibility: Add 0.0.0.0/0 (but add authentication)
// For security: Add specific production server IPs
```

### SSL/TLS Certificate

**For HTTPS (Highly Recommended):**

**Option 1: Let's Encrypt (Free, Auto-Renewal)**
```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

**Option 2: Self-Signed (Development Only)**
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

**Option 3: Cloud Provider (AWS, GCP, Azure)**
- Most platforms offer free SSL/TLS
- Usually automatic with deployment

---

## Docker Deployment

### Building Docker Image

**Local Build:**
```bash
# Build image
docker build -t skin-scan-api:latest .

# Tag for registry
docker tag skin-scan-api:latest YOUR_REGISTRY/skin-scan-api:latest

# Push to registry (Docker Hub example)
docker login
docker push YOUR_REGISTRY/skin-scan-api:latest
```

### Running Docker Container

**Standalone (Single Container):**
```bash
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e JWT_SECRET="your-secret-key" \
  -e NODE_ENV="production" \
  --name skin-scan-api \
  skin-scan-api:latest
```

**With Docker Compose (Local Development):**
```bash
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop containers
docker-compose down
```

**Production Optimizations:**
```dockerfile
# In Dockerfile
FROM node:18-alpine AS builder  # Smaller base image

# Multi-stage build to reduce final image size
COPY --from=builder /app/dist /app/dist

# Run as non-root user
USER node

# Set health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/healthz || exit 1
```

---

## Platform-Specific Guides

### Render.com (Recommended for Beginners)

**Step 1: Push Code to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/skin-scan-api.git
git branch -M main
git push -u origin main
```

**Step 2: Create Render Service**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** skin-scan-api
   - **Environment:** Docker (or Node.js + Python)
   - **Region:** Choose closest to users
   - **Plan:** Starter (free) for testing, Pro for production

**Step 3: Add Environment Variables**
1. In Render dashboard: Settings → Environment
2. Add from `.env`:
   ```
   MONGO_URI = mongodb+srv://...
   JWT_SECRET = your-secret-key
   NODE_ENV = production
   ```

**Step 4: Deploy**
- Push to main branch
- Render auto-deploys

**Step 5: Configure Domain**
1. Settings → Custom Domain
2. Add your domain (yourdomain.com)
3. Update DNS CNAME records

**Monitoring:**
- Logs: Render dashboard
- Metrics: Built-in monitoring
- Alerts: Email notifications

---

### Vercel (Frontend) + External Backend

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend/my-app
vercel
```

**Backend Elsewhere (Render/Railway/etc)**

---

### AWS (EC2 + RDS)

**Architecture:**
```
ALB (Load Balancer)
  ↓
EC2 Instance (Docker)
  ↓
RDS MongoDB (not available, use Atlas instead)
  OR
Atlas MongoDB
```

**Step 1: Launch EC2 Instance**
```bash
# AWS Console → EC2 → Launch Instance

# Configuration:
# - AMI: Ubuntu 22.04 LTS
# - Instance type: t3.medium (1GB RAM minimum)
# - Storage: 30GB gp3
# - Security group: Allow 80, 443, 22

# SSH into instance
ssh -i key.pem ubuntu@instance-ip
```

**Step 2: Install Docker**
```bash
# On EC2 instance
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu to docker group
sudo usermod -aG docker ubuntu
```

**Step 3: Deploy Docker Container**
```bash
# Pull image
docker pull YOUR_REGISTRY/skin-scan-api:latest

# Run container
docker run -d -p 80:5000 \
  -e MONGO_URI="..." \
  -e JWT_SECRET="..." \
  --restart unless-stopped \
  YOUR_REGISTRY/skin-scan-api:latest
```

**Step 4: Setup SSL with Nginx**
```bash
# Install Nginx
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default

# Add:
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable SSL
sudo certbot --nginx -d yourdomain.com
```

---

### Railway.app

**Simple Alternative to Render:**

1. Go to [railway.app](https://railway.app)
2. Create project
3. Connect GitHub repository
4. Select root directory (or create docker.json config)
5. Add MongoDB service
6. Configure environment variables
7. Deploy!

---

### DigitalOcean App Platform

1. Create DigitalOcean account
2. Paste app.yaml to specify configuration
3. Connect repository
4. Deploy!

**Example app.yaml:**
```yaml
name: skin-scan-api
services:
  - name: api
    github:
      repo: YOUR_USERNAME/skin-scan-api
      branch: main
    build_command: npm install && npm run build
    run_command: npm start
    http_port: 5000
    envs:
      - key: MONGO_URI
        value: ${db.db_connection_uri}
      - key: JWT_SECRET
        value: ${JWT_SECRET}

databases:
  - name: db
    engine: MONGODB
    version: "4.4"
```

---

## Database Migration

### Initial Setup

**First Deployment:**
```bash
# Connect to MongoDB and create indexes
mongosh "mongodb+srv://..."

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.history.createIndex({ userId: 1, createdAt: -1 })
db.feedback.createIndex({ userId: 1, predictionId: 1 }, { unique: true })
```

### Schema Changes

**Adding a New Field:**
1. **Code** - Update Mongoose schema
2. **Test** - Verify changes locally
3. **Deploy** - New code handles both old/new format
4. **Migrate** - Write one-off script if needed

**Example Migration Script:**
```javascript
// scripts/migrate-v1-to-v2.js
const mongoose = require('mongoose');
const History = require('../backend/models/History');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Add new field with default value
  await History.updateMany(
    { category: { $exists: false } },
    { $set: { category: 'uncategorized' } }
  );
  
  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

// Run: node scripts/migrate-v1-to-v2.js
```

### Backup & Restore

**MongoDB Atlas Backups:**
```bash
# Enable in Atlas console
# Admin → Backup → Configure Backup

# Restore from backup
# Backup → Actions → Restore
```

**Manual Backup:**
```bash
# Export all data
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore from backup
mongorestore --uri "mongodb+srv://..." ./backup
```

---

## Security Hardening

### Pre-Production Checklist

**Authentication & Authorization**
- [ ] JWT_SECRET is 32+ characters, random
- [ ] JWT_EXPIRATION is reasonable (7 days)
- [ ] Rate limiting enabled
- [ ] Password hashing using bcryptjs
- [ ] CORS whitelist contains only allowed origins

**Network Security**
- [ ] HTTPS/TLS enabled (redirect HTTP to HTTPS)
- [ ] Security headers set (via Helmet.js)
- [ ] Database connection uses TLS
- [ ] Firewall restricts unnecessary ports

**Data Security**
- [ ] Sensitive data not logged (passwords, tokens)
- [ ] Temporary files cleaned up
- [ ] Database backups encrypted at rest
- [ ] User data only accessible by owner

**API Security**
- [ ] Rate limiting on all endpoints
- [ ] Input validation on all fields
- [ ] Error messages don't leak sensitive info
- [ ] No hardcoded credentials in code

**Infrastructure**
- [ ] Environment variables in secure vault (not .env file)
- [ ] Regular security patches applied
- [ ] Monitoring & alerting configured
- [ ] DDoS protection enabled
- [ ] Regular security audits scheduled

### Production Environment Variables

**NEVER**:
```bash
# ❌ Wrong - exposed in Git history
MONGO_URI=mongodb+srv://user:password@...
JWT_SECRET=my-super-secret-key

# ❌ Wrong - visible in docker build output
ENV JWT_SECRET=my-super-secret-key

# ❌ Wrong - hardcoded in code
const secret = "my-secret-key";
```

**ALWAYS**:
```bash
# ✅ Correct - use environment variables
docker run -e JWT_SECRET="$(cat .env.prod)" ...

# ✅ Correct - use secrets management
# AWS Secrets Manager, HashiCorp Vault, etc.

# ✅ Correct - platform-native (Render, Vercel, etc)
# Set in dashboard, not in code
```

### Monitoring Suspicious Activity

**Set Up Alerts For:**
- Multiple failed login attempts from same IP
- Unusual spike in predictions
- Database query errors
- Memory/CPU usage spikes
- Unhandled exceptions

---

## Monitoring & Logging

### Application Logging

**Current Logger Setup (backend/utils/logger.js):**
```javascript
// Logs to console (Docker captures this)
logger.info('Prediction successful', { userId, confidence });
logger.error('Database error', { error: err.message });
logger.warn('Rate limit approaching', { ip, remaining });
```

### Structured Logging (For Production)

**Install Winston or Bunyan:**
```bash
npm install winston
```

**Configure:**
```javascript
// backend/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'skin-scan-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

module.exports = logger;
```

### Log Aggregation

**Send Logs to External Service:**

**Option 1: Render Logs**
- Included with Render hosting
- View in dashboard

**Option 2: Loggly**
```bash
npm install loggly
```

**Option 3: DataDog**
```bash
npm install datadog-nodejs-apm
```

**Option 4: ELK Stack (Advanced)**
- Elasticsearch + Logstash + Kibana
- Self-hosted log aggregation

### Monitoring Metrics

**Key Metrics to Track:**
- Prediction processing time
- API response times
- Error rate
- Database query performance
- Memory/CPU usage
- Concurrent users

**Tools:**
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **New Relic** - APM (application performance monitoring)
- **DataDog** - Comprehensive monitoring
- **Sentry** - Error tracking

---

## Rollback Procedures

### Quick Rollback (If Deployment Fails)

**Render.com:**
1. Go to Deployments
2. Click previous successful deployment
3. Click "Redeploy"

**Docker (Manual):**
```bash
# Stop current container
docker stop skin-scan-api

# Remove it
docker rm skin-scan-api

# Run previous version
docker run -d -p 5000:5000 \
  -e MONGO_URI="..." \
  --name skin-scan-api \
  skin-scan-api:v1.0.0  # Previous version tag
```

**AWS CodeDeploy:**
```bash
# Via AWS Console
# Deployments → Select failed deployment → Actions → Rollback
```

### Database Rollback

**If Database Migration Failed:**

```bash
# Check backup point
# MongoDB Atlas Console → Backups

# Restore to specific point in time
# Atlas Console → Backup → Actions → Restore

# Or manually restore from dump
mongorestore --uri "mongodb+srv://..." ./backup-2024-03-21
```

### Version Tags

**Semantic Versioning:**
```bash
# Tag releases
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# Build specific version
docker build -t skin-scan-api:v1.0.0 .
docker push skin-scan-api:v1.0.0
```

---

## Troubleshooting

### Common Deployment Issues

#### Issue: "Cannot connect to MongoDB"
**Symptoms:** App crashes with connection error
**Solutions:**
```bash
# 1. Verify connection string
echo $MONGO_URI  # Check if set

# 2. Check IP whitelist
# MongoDB Atlas → Network Access → IP Whitelist
# Add your server IP or 0.0.0.0/0

# 3. Verify credentials
# Test connection locally with same URI

# 4. Check network
curl -I https://cluster.mongodb.net  # Can you reach MongoDB?

# 5. Check DNS
nslookup cluster.mongodb.net
```

#### Issue: "Module not found" / "Cannot find module"
**Symptoms:** Error: `Cannot find module 'express'`
**Solutions:**
```bash
# Make sure dependencies are installed in Dockerfile
# Check package.json has all required packages
npm install

# Verify lock file
git status  # Should show package-lock.json

# In Docker:
# Ensure npm install runs in Dockerfile
RUN npm ci --only=production  # Use ci for CI/CD
```

#### Issue: "Python script not found"
**Symptoms:** Error: `ENOENT: no such file or directory, open 'model/predict.py'`
**Solutions:**
```bash
# Check file exists in Docker
docker run -it skin-scan-api:latest ls -la /app/model/

# Verify COPY command in Dockerfile
# Should have: COPY model/ /app/model/

# Check working directory
# Dockerfile should: WORKDIR /app
```

#### Issue: "Out of Memory" or "Container killed"
**Symptoms:** Container restarts randomly
**Solutions:**
```bash
# Check memory limits
docker stats

# Increase memory in platform settings
# Render: Instance Type
# AWS: Instance size
# Docker: --memory 512m

# Optimize code
# - Use streaming for large responses
# - Implement pagination
# - Cache frequently accessed data
```

#### Issue: "SSL certificate error"
**Symptoms:** Browser shows security warning
**Solutions:**
```bash
# Verify certificate is installed
certbot certificates  # Shows installed certs

# Check certificate expiration
openssl s_client -connect yourdomain.com:443

# Renew certificate
sudo certbot renew

# For self-signed certs, add to trusted store
# Browser Settings → Certificates → Import
```

### Debug Mode

**Enable Debug Logging:**
```bash
# Set environment variable
export LOG_LEVEL=debug

# Or in .env
LOG_LEVEL=debug

# Backend will output verbose logs
```

**Test Health Endpoint:**
```bash
curl https://yourdomain.com/healthz

# Should return 200 OK with status
# If fails, API is down
```

**Test Database:**
```bash
mongosh "mongodb+srv://..."

# In MongoDB shell
db.users.count()  # Should return a number
```

---

## Next Steps

1. **Monitor Your Deployment**
   - Check logs regularly
   - Set up alerts
   - Monitor performance metrics

2. **Plan Updates**
   - Regular security patches
   - Dependency updates
   - Feature releases

3. **Backup Strategy**
   - Daily backups
   - Test restore procedures
   - Document recovery steps

4. **Scale When Needed**
   - Monitor usage growth
   - Plan horizontal scaling
   - Consider multi-region deployment

---

**Version:** 1.0  
**Last Updated:** March 2024  
**Status:** Production Ready ✅

For questions, refer to [docs/README.md](README.md) or open an issue on GitHub.
