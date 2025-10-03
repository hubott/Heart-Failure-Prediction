from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel

# Create app
app = FastAPI()

# Allow requests from frontend (any origin for now)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict to ["http://127.0.0.1:5500"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clf = joblib.load("models/heart_model.pkl")

@app.post("/predict")
def predict(data: dict):
    df = pd.DataFrame([data])  # wrap dict into DataFrame
    prediction = clf.predict(df)[0]
    confidence = clf.predict_proba(df)[0]
    confidence = float(confidence[prediction])
    return {"prediction": int(prediction), "confidence": confidence}