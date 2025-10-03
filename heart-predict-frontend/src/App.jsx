import { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    Age: 24,
    Sex: "M",
    ChestPainType: "ATA",
    RestingBP: 120,
    Cholesterol: 220,
    FastingBS: 0,
    RestingECG: "Normal",
    MaxHR: 175,
    ExerciseAngina: "Y",
    Oldpeak: 1,
    ST_Slope: "Flat"
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericData = { ...formData };
    ["Age","RestingBP","Cholesterol","FastingBS","MaxHR","Oldpeak"].forEach(k => {
      numericData[k] = parseFloat(numericData[k]);
    });
    const res = await fetch("http://3.26.33.59:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(numericData)
    });
    const json = await res.json();
    setResult(json.prediction);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Heart Failure Prediction</h1>
      <form className="max-w-md mx-auto bg-white p-6 rounded shadow-md space-y-4" onSubmit={handleSubmit}>

        <div className="form-field">
          <label className="numeric-input">Age:
          <input name="Age" value={formData.Age} onChange={handleChange} />
          </label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Sex:
            <select name="Sex" value={formData.Sex} onChange={handleChange}>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Chest Pain Type:
            <select name="ChestPainType" value={formData.ChestPainType} onChange={handleChange}>
              <option value="TA">Typical Angina</option>
              <option value="ATA">Atypical Angina</option>
              <option value="NAP">Non-Anginal Pain</option>
              <option value="ASY">Asymptomatic</option>
            </select>
          </label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Resting Blood Pressure: <input name="RestingBP" value={formData.RestingBP} onChange={handleChange} /></label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Cholesterol: <input name="Cholesterol" value={formData.Cholesterol} onChange={handleChange} /></label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Fasting Blood Sugar:
            <select name="FastingBS" value={formData.FastingBS} onChange={handleChange}>
              <option value={1}>FastingBS {'>'} 120 mg/dl</option>
              <option value="ATA">FastingBS {'≤'} 120 mg/dl</option>
            </select>
          </label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Resting ECG:
            <select className="select-input" name="RestingECG" value={formData.RestingECG} onChange={handleChange}>
              <option value="Normal">Normal</option>
              <option value="ST">ST-T wave abnormality</option>
              <option value="LVH">showing probable or definite left ventricular hypertrophy by Estes' criteria</option>
            </select>
          </label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Max Heart Rate: <input name="MaxHR" value={formData.MaxHR} onChange={handleChange} /></label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Exercise-Induced Angina:
            <select className="select-input" name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange}>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">Old Peak: <input name="Oldpeak" value={formData.Oldpeak} onChange={handleChange} /></label>
          <br/>
        </div>

        <div className="form-field">
          <label className="numeric-input">ST-Slope:
            <select className="select-input" name="ST_Slope" value={formData.ST_Slope} onChange={handleChange}>
              <option value="Up">Upsloping</option>
              <option value="Flat">No Slope</option>
              <option value="Down">Downsloping</option>
            </select>
          </label>
          <br/>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Predict</button>
      </form>
      <h2>Result: {result !== null ? result : "No prediction yet"}</h2>
    </div>
  );
}
