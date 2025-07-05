# SkinScan API

A backend system that uses a trained ResNet18 model to analyze skin lesion images and predict whether they are benign or malignant. Includes authentication, user history tracking, and image upload handling.

## Stack
- Node.js + Express
- MongoDB (Mongoose)
- Python (PyTorch inference)
- JWT Auth
- Multer for image uploads

## Project Structure
- `github/workflows/`: Continuous Integration
  - ci.yml # GitHub Actions workflow for testing and validation
- `/backend`: Express API
  - api/ # Express routes (auth, predict, history, feedback)
  - controllers/ # Route logic
  -  middleware/ # Auth & rate limiter
  -  models/ # Mongoose schemas
  -  tests/ # Jest + Supertest
  -  server.js # Express app
  -  index.js # MongoDB + server entry
- `/model`: Python model loader and predictor
  - predict.py # Inference script
  - transforms.py # Preprocessing
  - best_model.pt # Trained PyTorch model
- `/docs`: API reference, architecture, metrics

## Features
- **User Auth** – Register/login with hashed passwords (bcrypt + JWT)
- **Skin Lesion Prediction** – Upload images and get model predictions (PyTorch backend)
- **Prediction History** – Authenticated users can retrieve their past predictions
- **Feedback System** – Submit accuracy feedback per prediction
- **CI with GitHub Actions** – Automated backend tests on push/PR
- **Jest + Supertest** – Full unit & integration testing
- **Rate Limiting** – Protects sensitive endpoints from abuse

