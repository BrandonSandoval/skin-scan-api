# 📚 Documentation Index

**Version:** 1.0  
**Last Updated:** March 2024

Welcome to the SkinScan API documentation! This guide will help you navigate all available resources.

---

## 📖 Main Documentation

### 🚀 Getting Started
- **[Quick Start](../README.md)** - 5-minute setup guide
- **[Setup Guide](SETUP.md)** - Detailed installation for all platforms
  - macOS, Linux, Windows installation
  - Database setup (local & Atlas)
  - Environment configuration
  - Verification steps

### 🔌 API Reference
- **[Complete API Documentation](API.md)** - All endpoints with examples
  - Authentication endpoints
  - Prediction endpoints
  - History & Feedback
  - Dashboard & Metrics
  - Error codes & rate limiting
  - Request/response examples
  - Schema definitions

### 🏗️ Architecture
- **[Architecture Documentation](ARCHITECTURE.md)** - System design & data flow
  - System overview diagram
  - Component descriptions
  - Data flow diagrams
  - Authentication flow
  - Image prediction pipeline
  - Technology choices & rationale
  - Security considerations
  - Scalability strategies

### 🚀 Deployment
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment
  - Pre-deployment checklist
  - Environment setup
  - Docker deployment
  - Platform-specific guides (Render, AWS, DigitalOcean, etc.)
  - Database migration
  - Security hardening
  - Monitoring & logging
  - Rollback procedures

### 🤝 Contributing
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
  - Code of conduct
  - Development setup
  - Code style standards
  - Testing guidelines
  - Commit message format
  - Pull request process
  - Issue reporting

---

## 📚 By Use Case

### I Want to...

#### **🎯 Get Started Quickly**
1. Read [Quick Start](../README.md#-quick-start)
2. Follow [Setup Guide](SETUP.md)
3. Try [Example API Requests](API.md#example-requests)

#### **💻 Set Up Development Environment**
1. [Setup Guide](SETUP.md) - Choose your OS
2. [CONTRIBUTING.md](../CONTRIBUTING.md#development-setup)
3. Run tests: `npm test`

#### **🔍 Understand the API**
1. [API.md - Authentication](API.md#authentication)
2. [API.md - Endpoints](API.md#predictions)
3. [API.md - Error Codes](API.md#error-codes)
4. [Example Requests](API.md#example-requests)

#### **📊 Understand System Architecture**
1. [ARCHITECTURE.md - System Overview](ARCHITECTURE.md#system-overview)
2. [ARCHITECTURE.md - Architecture Diagram](ARCHITECTURE.md#architecture-diagram)
3. [ARCHITECTURE.md - Data Flow](ARCHITECTURE.md#data-flow)
4. [ARCHITECTURE.md - Technology Choices](ARCHITECTURE.md#technology-choices)

#### **🚀 Deploy to Production**
1. [Pre-Deployment Checklist](DEPLOYMENT.md#pre-deployment-checklist)
2. Choose your platform:
   - [Render.com](DEPLOYMENT.md#rendercom-recommended-for-beginners)
   - [AWS](DEPLOYMENT.md#aws-ec2--rds)
   - [DigitalOcean](DEPLOYMENT.md#digitalocean-app-platform)
   - [Railway.app](DEPLOYMENT.md#railwayapp)
3. [Database Setup](DEPLOYMENT.md#database-migration)
4. [Security Hardening](DEPLOYMENT.md#security-hardening)

#### **🤝 Contribute Code**
1. [Code of Conduct](../CONTRIBUTING.md#code-of-conduct)
2. [Development Setup](../CONTRIBUTING.md#development-setup)
3. [Code Style Guide](../CONTRIBUTING.md#code-style--standards)
4. [Testing Requirements](../CONTRIBUTING.md#testing)
5. [Pull Request Process](../CONTRIBUTING.md#pull-requests)

#### **🐛 Fix a Bug**
1. [Issue Reporting](../CONTRIBUTING.md#issue-reporting)
2. [Development Setup](../CONTRIBUTING.md#development-setup)
3. [Testing Guide](../CONTRIBUTING.md#testing)
4. [Commit Messages](../CONTRIBUTING.md#commit-messages)

#### **❓ Troubleshoot a Problem**
1. [Setup Troubleshooting](SETUP.md#troubleshooting)
2. [Deployment Troubleshooting](DEPLOYMENT.md#troubleshooting)
3. [API Error Codes](API.md#error-codes)

---

## 🗂️ File Structure

```
skin-scan-api/
├── README.md                    ← Start here!
├── CONTRIBUTING.md              ← Contributing guide
│
├── docs/
│   ├── README.md               ← This file
│   ├── API.md                  ← API reference
│   ├── ARCHITECTURE.md         ← System design
│   ├── SETUP.md                ← Installation guide
│   └── DEPLOYMENT.md           ← Production deployment
│
├── backend/
│   ├── server.js               ← Express app
│   ├── index.js                ← Entry point
│   ├── package.json            ← Dependencies
│   ├── api/                    ← Route definitions
│   ├── controllers/            ← Business logic
│   ├── models/                 ← Database schemas
│   ├── middleware/             ← Custom middleware
│   ├── utils/                  ← Helper functions
│   └── tests/                  ← Test suite
│
├── frontend/
│   └── my-app/                 ← Next.js app
│       ├── src/app/            ← Page components
│       ├── src/components/     ← Reusable components
│       ├── src/lib/            ← Utilities
│       └── package.json        ← Dependencies
│
├── model/
│   ├── predict.py              ← ML inference
│   ├── transforms.py           ← Image preprocessing
│   ├── best_model.pt           ← Trained model
│   └── requirements.txt        ← Python dependencies
│
└── .env.example                ← Environment template
```

---

## 🔑 Key Concepts

### Authentication
- **JWT Tokens** - Stateless authentication
- **Bcrypt Hashing** - Password security
- **Expiration** - Tokens expire after 7 days
- **Authorization Header** - Include token in requests

→ See [API.md - Authentication Flow](API.md#authentication-flow-diagram)

### Prediction Pipeline
1. Upload image → Validation → Preprocessing
2. Model inference → Classification
3. Store in database → Return confidence score

→ See [ARCHITECTURE.md - Image Prediction Pipeline](ARCHITECTURE.md#image-prediction-pipeline)

### Data Models
- **User** - Registered users (email, password, role)
- **History** - Prediction records (image, result, confidence)
- **Feedback** - User feedback (accuracy, notes)

→ See [API.md - Schema Definitions](API.md#schema-definitions)

### Security Layers
1. HTTPS/TLS encryption
2. JWT token validation
3. Rate limiting
4. Input validation
5. CORS whitelist
6. Security headers (Helmet.js)

→ See [ARCHITECTURE.md - Security Considerations](ARCHITECTURE.md#security-considerations)

---

## 📊 Quick Reference

### API Endpoints
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| POST | `/api/predict` | ✅ |
| GET | `/api/history` | ✅ |
| POST | `/api/feedback` | ✅ |
| GET | `/api/dashboard` | ✅ |
| GET | `/api/metrics` | ✅ |
| GET | `/healthz` | ❌ |

→ Full reference: [API.md](API.md)

### Environment Variables
```bash
NODE_ENV=development        # Or production
PORT=5000
MONGO_URI=mongodb://...     # Database connection
JWT_SECRET=your-secret-key  # Token signing
JWT_EXPIRATION=7d           # Token lifetime
LOG_LEVEL=debug             # Logging verbosity
```

→ Details: [SETUP.md - Environment Configuration](SETUP.md#environment-configuration)

### Commands
```bash
# Backend
npm install                 # Install dependencies
npm run lint               # Check code style
npm run format             # Fix formatting
npm test                   # Run tests
npm run start              # Start server

# Frontend
npm install
npm run dev                # Start dev server
npm run build              # Production build
npm run export             # Static export
```

→ More: [CONTRIBUTING.md - Development Setup](../CONTRIBUTING.md#development-setup)

---

## 🎓 Learning Paths

### For Frontend Developers
1. [Quick Start](../README.md#-quick-start)
2. [Setup Guide - Frontend](SETUP.md#step-4-frontend-setup)
3. [API Documentation](API.md)
4. [Architecture - Frontend Layer](ARCHITECTURE.md#frontend-nextjs--react)
5. Start modifying components in `frontend/my-app/src/`

### For Backend Developers
1. [Quick Start](../README.md#-quick-start)
2. [Setup Guide - Backend](SETUP.md#step-2-backend-setup)
3. [API Documentation](API.md)
4. [Architecture - Backend Layer](ARCHITECTURE.md#backend-expressjs--nodejs)
5. [Contributing - Code Style](../CONTRIBUTING.md#code-style--standards)
6. Start creating features in `backend/`

### For DevOps/Platform Engineers
1. [Deployment Guide](DEPLOYMENT.md)
2. [Architecture - System Overview](ARCHITECTURE.md#system-overview)
3. [Docker Deployment](DEPLOYMENT.md#docker-deployment)
4. [Security Hardening](DEPLOYMENT.md#security-hardening)
5. [Monitoring & Logging](DEPLOYMENT.md#monitoring--logging)

### For ML/Data Scientists
1. [Architecture - ML Component](ARCHITECTURE.md#aiml-component-python--pytorch)
2. [Image Prediction Pipeline](ARCHITECTURE.md#image-prediction-pipeline)
3. Modify `model/predict.py` and `model/transforms.py`
4. Re-train `best_model.pt`
5. Test locally before deploying

---

## 🔗 External Resources

### Official Documentation
- [Node.js Docs](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [PyTorch Docs](https://pytorch.org/docs/)
- [Docker Docs](https://docs.docker.com/)

### Learning Resources
- [Express.js Tutorial](https://expressjs.com/en/starter/installing.html)
- [React Tutorial](https://react.dev/learn)
- [MongoDB University](https://university.mongodb.com/)
- [PyTorch Tutorials](https://pytorch.org/tutorials/)
- [Docker for Developers](https://docker-curriculum.com/)

### Tools & Services
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud MongoDB
- [Render.com](https://render.com/) - Hosting (free tier available)
- [GitHub](https://github.com/) - Version control
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - MongoDB GUI

---

## ❓ FAQ

**Q: How do I get started?**  
A: See [Quick Start](../README.md#-quick-start) and [Setup Guide](SETUP.md)

**Q: How do I test my changes?**  
A: See [CONTRIBUTING.md - Testing](../CONTRIBUTING.md#testing)

**Q: How do I deploy to production?**  
A: See [Deployment Guide](DEPLOYMENT.md) and choose your platform

**Q: What database should I use?**  
A: MongoDB Atlas (cloud) recommended. See [Setup - Database](SETUP.md#database-setup)

**Q: How do I add a new API endpoint?**  
A: Create route in `/api/`, controller in `/controllers/`, add tests

**Q: Where do I report bugs?**  
A: [GitHub Issues](https://github.com/YOUR_USERNAME/skin-scan-api/issues)

**Q: Can I contribute?**  
A: Yes! See [Contributing Guide](../CONTRIBUTING.md)

**Q: Is this production-ready?**  
A: Yes, but ensure you complete [Pre-Deployment Checklist](DEPLOYMENT.md#pre-deployment-checklist)

---

## 📞 Support & Community

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/skin-scan-api/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/skin-scan-api/discussions)
- **Email:** support@example.com
- **Documentation Issues:** Open an issue with label `documentation`

---

## 🗺️ Documentation Map

```
START HERE
    │
    ├─→ 🎯 New to project?
    │   └─→ README.md → SETUP.md → Try example API calls
    │
    ├─→ 💻 Development?
    │   └─→ SETUP.md → CONTRIBUTING.md → Create feature branch
    │
    ├─→ 🔌 Using the API?
    │   └─→ API.md → Example Requests → Test with Postman/cURL
    │
    ├─→ 🏗️ Understanding system?
    │   └─→ ARCHITECTURE.md → Diagrams → Data flow
    │
    ├─→ 🚀 Going to production?
    │   └─→ DEPLOYMENT.md → Choose platform → Deploy!
    │
    └─→ 🤝 Want to contribute?
        └─→ CONTRIBUTING.md → Fork repo → Create PR
```

---

## 📝 Documentation Versions

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0 | Mar 2024 | ✅ Current | Initial complete documentation |
| 0.9 | Earlier | ⛔ Outdated | See commit history |

---

## 📄 License

Documentation is provided under the same ISC License as the project.
See [LICENSE](../LICENSE) file for details.

---

**Last Updated:** March 2024  
**Maintained By:** Development Team  
**Status:** Complete & Up-to-Date ✅

---

**Questions?** 
- Check [FAQ](#-faq)
- Read relevant guide above
- Open [GitHub Issue](https://github.com/YOUR_USERNAME/skin-scan-api/issues)
- Email support@example.com

Happy learning! 🚀
