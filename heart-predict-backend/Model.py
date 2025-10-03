import pandas as pd
import numpy as np
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC as SVM
from sklearn.linear_model import LogisticRegression


# Define hyperparameter grid for tuning
param_grid = {
    "classifier__n_estimators": [100, 200, 300],
    "classifier__max_depth": [None, 5, 10, 20],
    "classifier__min_samples_split": [2, 5, 10]
}


#Read data in and display basic info
df = pd.read_csv('data/heart.csv')
print(df.head())
print(df.info())
print(df.describe())

# Define features
numericalFeatures = ['Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR', 'Oldpeak']
categoricalFeatures = ['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope']

# Create preprocessing pipelines for both numeric and categorical data.
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numericalFeatures),
        ('cat', OneHotEncoder(), categoricalFeatures)
    ]
)

# Split data into features and target
X = df.drop('HeartDisease', axis=1)
y = df['HeartDisease']

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)


# Create a pipeline that first preprocesses the data and then applies the classifier
clf = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

svm = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', SVM(kernel='rbf', probability=False, random_state=42))
])

logReg = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000))
])

logReg.fit(X_train, y_train)
y_pred_logReg = logReg.predict(X_test)
print("LOGREG" + classification_report(y_test, y_pred_logReg))

svm.fit(X_train, y_train)
y_pred_svm = svm.predict(X_test)
print("SVM" + classification_report(y_test, y_pred_svm))

# Hyperparameter tuning with GridSearchCV
grid_search = GridSearchCV(clf, param_grid, cv=5, scoring='f1')
grid_search.fit(X_train, y_train)
print("Best parameters:", grid_search.best_params_)
print("Best cross-validation accuracy:", grid_search.best_score_)

# Test set evaluation
y_pred = grid_search.predict(X_test)
print(y_pred)


# Log and save classification report
report = classification_report(y_test, y_pred)
with open('classification_report.txt', 'w') as f:
        f.write(f"{report}\n")

# Save the model
joblib.dump(grid_search, "models/heart_model.pkl")