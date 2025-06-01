import torch
import torch.nn as nn
from torchvision import models
from PIL import Image
import sys
import json
import os
from transforms import inference_transform

# Set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Get absolute path to this file's directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'best_model.pt')

# Load model architecture
model = models.resnet18(weights=None)  # Modern replacement for pretrained=False
model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(model.fc.in_features, 1)
)

# Load model weights
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()
model.to(device)

def predict(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
        image = inference_transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(image)
            prob = torch.sigmoid(output).item()
            label = "Benign" if prob < 0.5 else "Malignant"
            return {
                "label": label,
                "confidence": round(prob, 4)
            }
    except Exception as e:
        return { "error": str(e) }

if __name__ == "__main__":
    image_path = sys.argv[1]
    result = predict(image_path)
    print(json.dumps(result))
