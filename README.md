# 🔬 SkinScan API

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

A **production-ready AI-powered skin lesion diagnostic platform** that leverages deep learning (ResNet18) to analyze dermoscopic images and predict whether lesions are **benign or malignant**. Built with modern full-stack technologies, comprehensive authentication, and scalable architecture.

> **⚠️ Medical Disclaimer:** This tool is for educational and research purposes only. It should **NOT** be used for clinical diagnosis. Always consult a dermatologist for medical advice.

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Predictions** | ResNet18-based image classification with confidence scores |
| 🔐 **JWT Authentication** | Secure user registration & login with bcrypt hashing |
| 📊 **Prediction History** | Full audit trail of user predictions with timestamps |
| 💬 **Feedback System** | Collect accuracy feedback to improve model performance |
| 🛡️ **Security** | Helmet.js headers, CORS validation, rate limiting, input sanitization |
| 📈 **Metrics & Analytics** | Dashboard metrics on usage patterns and prediction accuracy |
| 🧪 **Full Test Suite** | Jest + Supertest integration tests with >80% coverage |
| 🐳 **Docker Ready** | Production-grade Dockerfile with optimized layers |
| 📱 **Modern Frontend** | Next.js 15 + React 19 with TypeScript & Tailwind CSS |
| ⚡ **High Performance** | Sub-2s inference, request logging, error handling |

---

## 📚 Stack Overview

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + bcryptjs
- **Validation:** Helmet.js, express-rate-limit, custom validators
- **File Upload:** Multer with image validation
- **Testing:** Jest + Supertest
- **Logging:** Custom logger utility

### AI/ML
- **Framework:** PyTorch
- **Model:** ResNet18 (transfer learning)
- **Input Format:** JPEG/PNG/WebP (validated, size-limited)
- **Output:** Label (Benign/Malignant) + Confidence (0.0-1.0)
- **Inference:** Python subprocess with error handling

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** TanStack React Query (data fetching)
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Charts:** Recharts

### DevOps
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment:** Renderâ€†(or any Docker-compatible host)
- **Package Managers:** npm (Node), pip (Python)

---

## 🚀 Quick Start

### Prerequisites

**System Requirements:**
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.8+ ([Download](https://www.python.org/))
- MongoDB 4.4+ (local or Atlas cloud)
- Git

**Optional:**
- Docker & Docker Compose
- Visual Studio Code with ESLint/Prettier extensions

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skin-scan-api.git
cd skin-scan-api
```

#### 2. Backend Setup

**macOS / Linux:**
```bash
cd backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Node dependencies
npm install

# Copy environment template
cp ../.env.example .env
# Edit .env with your MongoDB URI and JWT secret
nano .env
```

**Windows:**
```bash
cd backend

# Create Python virtual environment
python -m venv venv
venv\Scripts\activate

# Install Node dependencies
npm install

# Copy environment template
copy ..\.env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

#### 3. Python Model Setup

```bash
# Already in backend/ with venv active

# Install PyTorch (CPU or GPU)
# CPU (recommended for beginners):
pip install torch torchvision

# GPU (NVIDIA CUDA):
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# Install Python dependencies
pip install -r requirements.txt
```

#### 4. Frontend Setup

```bash
cd ../frontend/my-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your backend API URL
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start  # or npm run dev (with nodemon)
# Server running at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/my-app
npm run dev
# Next.js running at http://localhost:3000
```

**Terminal 3 - Test the API (Optional):**
```bash
# Health check
curl http://localhost:5000/healthz

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 🔧 Environment Variables

Create a `.env` file in the project root or in `backend/.env`:

```bash
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skin-scan?retryWrites=true&w=majority
# For local MongoDB: mongodb://localhost:27017/skin-scan

# Server Configuration
PORT=5000
NODE_ENV=development  # development, test, or production

# JWT Configuration
JWT_SECRET=your_super_secret_key_min_32_chars_recommended
JWT_EXPIRATION=7d  # Token expiry: 7d, 24h, 1h, etc.

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # 100 requests per window

# Python Model Path (Docker only)
PYTHON_MODEL_PATH=/app/model/best_model.pt

# Logging
LOG_LEVEL=info  # info, warn, error, debug

# CORS Origins (for frontend)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Frontend `.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=SkinScan
```

---

## 📁 Project Structure

```
skin-scan-api/
├── README.md                      # This file
├── Dockerfile                     # Production container config
├── docker-compose.yml             # Local dev container setup
├── package.json                   # Root package config
├── .env.example                   # Environment variables template
│
├── backend/                       # Express API server
│   ├── index.js                   # Entry point (MongoDB + server)
│   ├── server.js                  # Express app configuration
│   ├── package.json               # Backend dependencies
│   │
│   ├── api/                       # Route definitions
│   │   ├── auth.js                # /api/auth endpoints
│   │   ├── predict.js             # /api/predict endpoint
│   │   ├── history.js             # /api/history endpoint
│   │   ├── feedback.js            # /api/feedback endpoint
│   │   ├── dashboard.js           # /api/dashboard endpoint
│   │   └── metrics.js             # /api/metrics endpoint
│   │
│   ├── controllers/               # Route logic (business logic)
│   │   ├── authController.js      # Register, login, JWT
│   │   ├── predictController.js   # Image prediction logic
│   │   ├── historyController.js   # Prediction history queries
│   │   ├── feedbackController.js  # Feedback collection
│   │   ├── dashboardController.js # User dashboard data
│   │   └── metricsController.js   # System metrics
│   │
│   ├── middleware/                # Express middleware
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── uploadMiddleware.js    # Multer file handling
│   │   ├── rateLimiter.js         # Rate limiting config
│   │   ├── roleMiddleware.js      # Role-based access control
│   │   └── validationMiddleware.js# Input validation
│   │
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js                # User schema (email, role, password)
│   │   ├── History.js             # Prediction history schema
│   │   └── Feedback.js            # User feedback schema
│   │
│   ├── utils/                     # Utility functions
│   │   ├── logger.js              # Logging utility
│   │   └── validateImage.js       # Image validation logic
│   │
│   ├── tests/                     # Jest test suite
│   │   ├── auth.test.js           # Auth endpoint tests
│   │   ├── predict.test.js        # Prediction tests
│   │   ├── feedback.test.js       # Feedback tests
│   │   └── ...
│   │
│   ├── jest.setup.js              # Jest configuration
│   └── .eslintrc.json             # Linting rules
│
├── frontend/                      # Next.js React app
│   └── my-app/
│       ├── src/
│       │   ├── app/               # App Router pages
│       │   │   ├── page.tsx       # Home/landing page
│       │   │   ├── login/page.tsx # Login page
│       │   │   ├── register/page.tsx # Registration page
│       │   │   ├── upload/page.tsx   # Image upload page
│       │   │   ├── history/page.tsx  # Prediction history
│       │   │   ├── dashboard/page.tsx# User dashboard
│       │   │   ├── metrics/page.tsx  # System metrics
│       │   │   └── layout.tsx     # Root layout
│       │   │
│       │   ├── components/        # Reusable React components
│       │   │   ├── AuthGuard.tsx      # Protected route wrapper
│       │   │   ├── AuthRedirect.tsx   # Auth redirection logic
│       │   │   ├── LayoutWrapper.tsx  # Navigation wrapper
│       │   │   ├── Sidebar.tsx        # Navigation sidebar
│       │   │   ├── Providers.tsx      # App providers (Query, Toast)
│       │   │   └── ui/                # UI component library
│       │   │       ├── Button.tsx
│       │   │       ├── Card.tsx
│       │   │       ├── Input.tsx
│       │   │       ├── Alert.tsx
│       │   │       └── ...
│       │   │
│       │   └── lib/               # Utilities and helpers
│       │       └── api.ts         # Axios instance + request helpers
│       │
│       ├── public/                # Static assets
│       ├── package.json           # Frontend dependencies
│       ├── tsconfig.json          # TypeScript config
│       ├── tailwind.config.ts     # Tailwind CSS config
│       └── next.config.js         # Next.js config
│
├── model/                         # Python ML model
│   ├── predict.py                 # Model inference script
│   ├── transforms.py              # Image preprocessing
│   ├── best_model.pt              # Trained PyTorch model (~100MB)
│   └── requirements.txt            # Python dependencies
│
├── docs/                          # Documentation
│   ├── README.md                  # Docs index
│   ├── API.md                     # Complete API reference
│   ├── ARCHITECTURE.md            # System design & diagrams
│   ├── SETUP.md                   # Detailed setup guide
│   ├── DEPLOYMENT.md              # Production deployment
│   └── CONTRIBUTING.md            # Development guidelines
│
├── deploy/                        # Deployment scripts
│   ├── docker-entrypoint.sh       # Docker startup script
│   └── prod-env.example           # Production env template
│
└── .github/
    └── workflows/
        └── ci.yml                 # GitHub Actions CI/CD
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login & get JWT token |

### Predictions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/predict` | ✅ | Upload image & get prediction |

### History & Feedback
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/history` | ✅ | Retrieve user's prediction history |
| `POST` | `/api/feedback` | ✅ | Submit feedback on a prediction |

### Dashboard & Metrics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dashboard` | ✅ | User dashboard summary |
| `GET` | `/api/metrics` | ✅ | System usage metrics |

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/healthz` | ❌ | Health check endpoint |

**Full API Documentation:** See [docs/API.md](docs/API.md)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  - React 19 + TypeScript                                   │
│  - Tailwind CSS v4                                          │
│  - TanStack React Query                                     │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTPS/HTTP
                    │ /api/* requests
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (Express.js)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Middleware Layer:                                    │  │
│  │ - CORS, Helmet.js, Body Parser                       │  │
│  │ - Auth Middleware (JWT verification)                 │  │
│  │ - Rate Limiting, Request Logging                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Routes → Controllers → Models                    │  │
│  │ - Authentication, Predictions, History               │  │
│  │ - Feedback, Dashboard, Metrics                       │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────┬────────────────────────────────────────┬────────┘
            │ Mongoose ODM                           │
            │                                        │ subprocess
            ▼                                        ▼
┌─────────────────────────┐          ┌──────────────────────────┐
│  MongoDB Database       │          │  Python Inference       │
│  - Users                │          │  - ResNet18 Model       │
│  - Predictions          │          │  - Image Preprocessing  │
│  - History              │          │  - Label/Confidence Out │
│  - Feedback             │          └──────────────────────────┘
└─────────────────────────┘
```

---

## 🧪 Testing

Run the full test suite:

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with coverage report
npm test -- --coverage

# Run in watch mode (for development)
npm test -- --watch
```

**Test Coverage:**
- Authentication (register, login, JWT expiration)
- Prediction endpoint (valid/invalid images)
- History retrieval & filtering
- Feedback submission
- Input validation
- Error handling

---

## 🐳 Docker Deployment

### Build & Run Locally

```bash
# Build the Docker image
docker build -t skin-scan-api:latest .

# Run the container
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb://mongo:27017/skin-scan" \
  -e JWT_SECRET="your-secret-key" \
  skin-scan-api:latest
```

### Using Docker Compose (Recommended)

```bash
# Start backend + MongoDB
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

**See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production setup.**

---

## 🚀 Deployment

### Render.com (Recommended for Beginners)

1. Push code to GitHub
2. Connect repository to [Render.com](https://render.com)
3. Set environment variables in dashboard
4. Deploy!

**Full guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Other Platforms
- **AWS**: ECS, EC2, or Elastic Beanstalk
- **Google Cloud**: Cloud Run, App Engine
- **Azure**: App Service, Container Instances
- **DigitalOcean**: App Platform, Droplets
- **Railway.app**: Simple Git-based deployment

---

## 🛠️ Development

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Check code style
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Write tests first (TDD approach recommended)
3. Implement feature
4. Run `npm test` to verify
5. Commit with clear message: `git commit -m "feat: add new feature"`
6. Push & open Pull Request

**Full guide:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📖 Documentation

- **[docs/README.md](docs/README.md)** - Documentation index & quick links
- **[docs/API.md](docs/API.md)** - Complete API endpoint reference
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design & data flow
- **[docs/SETUP.md](docs/SETUP.md)** - Detailed setup for all platforms
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development guidelines

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Testing requirements
- Commit message format
- Issue reporting guidelines

---

## 📋 Roadmap

- [ ] Multi-class classification (melanoma, nevus, keratosis, etc.)
- [ ] Confidence interval estimation
- [ ] Model explanation (GradCAM visualization)
- [ ] Batch prediction API
- [ ] Export predictions (PDF reports)
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Advanced metrics & analytics dashboard

---

## 🔒 Security

### Key Security Measures

✅ **Authentication:** JWT with bcrypt password hashing
✅ **Headers:** Helmet.js for secure HTTP headers
✅ **CORS:** Strict origin whitelist
✅ **Rate Limiting:** Protects auth endpoints from brute force
✅ **Input Validation:** File type/size validation, sanitization
✅ **Logging:** Detailed audit logs for security events
✅ **Environment:** Secrets in `.env`, never committed to Git

### Reporting Security Issues

Found a vulnerability? Please email `security@example.com` instead of using GitHub issues.

---

## 📄 License

This project is licensed under the **ISC License** - see [LICENSE](LICENSE) file for details.

---

## 💬 Support & Community

- **Issues:** [GitHub Issues](https://github.com/yourusername/skin-scan-api/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/skin-scan-api/discussions)
- **Email:** support@example.com

---

## ⭐ Acknowledgments

- ResNet18 architecture by [Kaiming He et al.](https://arxiv.org/abs/1512.03385)
- Built with [Express.js](https://expressjs.com/), [Next.js](https://nextjs.org/), [PyTorch](https://pytorch.org/)
- Inspired by modern full-stack development practices

---

**Last Updated:** March 2024 | **Version:** 1.0.0

Made with ❤️ for dermatology research & education
