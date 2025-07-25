import { useState, useEffect } from 'react';
import './App.css';

// Interface for vitals data
interface Vitals {
  timestamp: string;
  heart_rate: number;
  blood_pressure: {
    systolic: number;
    diastolic: number;
  };
  pulse: number;
}

// Function to generate mock vitals data
const generateVitals = (): Vitals => {
  const now = new Date().toISOString();
  const heartRate = Math.floor(Math.random() * (150 - 60 + 1)) + 60; // 60–150 bpm
  return {
    timestamp: now,
    heart_rate: heartRate,
    blood_pressure: {
      systolic: Math.floor(Math.random() * (160 - 100 + 1)) + 100, // 100–160 mmHg
      diastolic: Math.floor(Math.random() * (100 - 60 + 1)) + 60, // 60–100 mmHg
    },
    pulse: heartRate, // Pulse matches heart rate
  };
};

export default function App() {
  const [vitals, setVitals] = useState<Vitals>({
    timestamp: new Date().toISOString(),
    heart_rate: 0,
    blood_pressure: { systolic: 0, diastolic: 0 },
    pulse: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Update vitals every 3 seconds
  useEffect(() => {
    const updateVitals = () => {
      const newVitals = generateVitals();
      setVitals(newVitals);

      // Check thresholds
      const isThresholdExceeded =
        newVitals.heart_rate > 120 ||
        newVitals.blood_pressure.systolic > 140 ||
        newVitals.blood_pressure.diastolic > 90;
      setShowAlert(isThresholdExceeded);

      // Reset alertSent when vitals return to normal
      if (!isThresholdExceeded && alertSent) {
        setAlertSent(false);
      }
    };

    // Initial update
    updateVitals();

    // Update every 3 seconds
    const interval = setInterval(updateVitals, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [alertSent]);

  // Handle emergency button click
  const handleEmergencyClick = () => {
    setAlertSent(true);
  };

  return (
    <div className="container">
      <h1 className="title">Vitals</h1>
      <div className="card">
        <div className="vital-item">
          <span className="vital-label">Timestamp</span>
          <span className="vital-value">{new Date(vitals.timestamp).toLocaleString()}</span>
        </div>
        <div className="vital-item">
          <span className="vital-label">Heart Rate</span>
          <span className="vital-value">{vitals.heart_rate} <span className="unit">bpm</span></span>
        </div>
        <div className="vital-item">
          <span className="vital-label">Blood Pressure</span>
          <span className="vital-value">{`${vitals.blood_pressure.systolic}/${vitals.blood_pressure.diastolic}`} <span className="unit">mmHg</span></span>
        </div>
        <div className="vital-item">
          <span className="vital-label">Pulse</span>
          <span className="vital-value">{vitals.pulse} <span className="unit">bpm</span></span>
        </div>
      </div>
      {showAlert && (
        <div className="alert">
          High Vitals Detected
        </div>
      )}
      <button
        className={`emergency-button ${alertSent || !showAlert ? 'disabled' : ''}`}
        onClick={handleEmergencyClick}
        disabled={alertSent || !showAlert}
      >
        Emergency Alert
      </button>
      {alertSent && (
        <div className="alert-sent">
          Alert Sent
        </div>
      )}
    </div>
  );
}