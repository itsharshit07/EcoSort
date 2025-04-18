from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf

app = FastAPI()

# Enable CORS to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = tf.keras.models.load_model("ai-model/e_waste_model.keras")

# Define class labels (update these with your actual class names)
CLASS_NAMES = [
    "Battery",
    "Keyboard",
    "Microwave",
    "Mobile",
    "Mouse",
    "PCB",
    "Player",
    "Printer",
    "Television",
    "Washing Machine",
]


# Preprocess image to match model's input requirements
def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))  # Resize image to 224x224
    img_array = np.array(image) / 255.0  # Normalize pixel values between 0-1
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


@app.post("/predict/")
async def predict(
    file: UploadFile = File(...),
    weight: float = Form(...),  # Receive weight from form data
    location: str = Form(...),  # Receive location from form data
):
    try:
        # Open image using PIL
        image = Image.open(file.file)

        # Preprocess the image
        processed_image = preprocess_image(image)

        # Make predictions
        prediction = model.predict(processed_image)
        predicted_class_index = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0])) * 100

        # Get the class name based on the predicted index
        waste_type = CLASS_NAMES[predicted_class_index]

        # Return response with waste type, confidence, weight, and location
        return JSONResponse(
            content={
                "waste_type": waste_type,
                "confidence": round(confidence, 2),  # Round confidence to 2 decimal places
                "weight": weight,
                "location": location,
            }
        )

    except Exception as e:
        # Return error if something goes wrong
        return JSONResponse(
            content={"error": f"Prediction failed: {str(e)}"},
            status_code=500,
        )
