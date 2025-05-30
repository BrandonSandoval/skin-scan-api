# SkinScan API

A backend system that uses a trained ResNet18 model to analyze skin lesion images and predict whether they are benign or malignant. Includes authentication, user history tracking, and image upload handling.

## Stack
- Node.js + Express
- MongoDB (Mongoose)
- Python (PyTorch inference)
- JWT Auth
- Multer for image uploads

## Project Structure
- `/backend`: Express API
- `/model`: Python model loader and predictor
- `/docs`: API reference, architecture, metrics
