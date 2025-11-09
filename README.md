# Heart-Failure-Prediction

A Machine Learning Web Application that predicts the likelihood of heart failure based on patient data. 
Built with FastAPI for the backend and React + Vite for the frontend.
The data for this model was obtained from Kaggle, specifically https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction

The model will tend to overpredict heart failure due to the fact that all data points are people coming in to a hospital anyway. This tool should not be used for any medical decisions as it is not reliable enough for any such use. The model also tunes hyperparameters to maximise for recall, as in this setting it is better to get a false positive than a false negative.

Frontend hosted using AWS S3: http://heart-failure-prediction-model.s3-website-ap-southeast-2.amazonaws.com

Live Backend API: http://3.26.33.59:8000/predict

## Features:

Predicts heart failure using a RandomForest model - which will be improved to a stacked model in the future
Uses numerical and categorical data
One-hot encoding for categorical features and standard scaling for numerical features
Frontend allows users to input data themselves and get a prediction

<pre> 
Heart-Failure-Prediction/
├─ heart-predict-backend/
│  ├─ app.py            # FastAPI backend
│  ├─ Model.py          # Builds the model and saves to models/
│  ├─ models/
│  │  └─ heart_model.pkl
│  ├─ data/
│  │   └─ heart.csv
│  └─ requirements.txt
├─ heart-predict-frontend/
│  ├─ src/
│  │  └─ App.jsx
│  ├─ package.json
│  └─ dist/            # Built files for deployment
├─ README.md
└─ .gitignore
  </pre>



## Installation:

### Backend 

Navigate to the backend folder
  cd heart-predict-backend

Create and activate a virtual environment
  python3 -m venv venv
  source venv/bin/activate      # Linux/macOS
  venv\Scripts\activate         # Windows

Install Dependencies
  pip install -r requirements.txt

### Frontend

Navigate to the frontend folder
  cd heart-predict-frontend

Install node.js dependencies
  npm install

Start the development server
  npm run dev

## Running the project

### Backend (API)

python -m uvicorn app:app --host 0.0.0.0 --port 8000

- Endpoint POST /predict
- Example request body:
    {
  "Age": 24,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 120,
  "Cholesterol": 220,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 175,
  "ExerciseAngina": "Y",
  "Oldpeak": 1,
  "ST_Slope": "Flat"
}
- Reponse
  {
    "prediction": 0,
  }

### Frontend

During development, update App.jsx to point to your local backend API (http://127.0.0.1:8000/predict)
To build for production:
  npm run build
Upload the dist/ folder contents to your S3 bucket for hosting

## Deployment

### Frontend

Use AWS S3 to host the static files
Make sure the bucket is public and has the correct CORS policy:
  [
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]

Upload all files from dist/.

### Backend

Use AWS EC2 for hosting the API.

Install Python, create a virtual environment, install dependencies, and run the API with Uvicorn or Gunicorn.

Make sure security groups allow inbound traffic on port 8000 (or your chosen port).

## Usage

Enter patient data in the frontend
Click Predict
Result shows the prediction
