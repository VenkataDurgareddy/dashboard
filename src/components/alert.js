import React, { useEffect, useState } from "react";
import "../styles/alert.css";

export default function Alert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Function to fetch alerts
    const fetchAlerts = () => {
      fetch("http://localhost:8000/alerts")
        .then((res) => res.json())
        .then((data) => setAlerts(data.alerts))
        .catch((err) => console.error("Failed to fetch alerts:", err));
    };

    // Initial fetch
    fetchAlerts();

    // Fetch every 5 seconds
    const interval = setInterval(fetchAlerts, 5000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alert-container">
      {/* Active Alerts */}
      <div className="alert-card">
        <h2 className="section-title">Active Alerts</h2>
        <p className="section-subtitle">Current system alerts requiring attention</p>

        {alerts.map((alert, index) => (
          <div key={index} className="alert-box">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div>
                <div className="alert-title">{alert.title}</div>
                <div className="alert-description">{alert.description}</div>
              </div>
            </div>
            <div className="alert-time">{alert.time}</div>
          </div>
        ))}
      </div>

      {/* Alert Configuration */}
      <div className="alert-card">
        <h2 className="section-title">Alert Configuration</h2>
        <p className="section-subtitle">Configure alert thresholds and notifications</p>

        <div className="config-row">
          <label>Error Rate Threshold</label>
          <input type="number" defaultValue={5} /> %
        </div>
        <div className="config-row">
          <label>Response Time Threshold</label>
          <input type="number" defaultValue={3} /> seconds
        </div>
        <div className="config-row">
          <label>Memory Usage Threshold</label>
          <input type="number" defaultValue={85} /> %
        </div>
        <div className="config-row">
          <label>Queue Length Threshold</label>
          <input type="number" defaultValue={100} /> jobs
        </div>

        <button className="update-btn-alert">
          <span className="gear-icon">⚙️</span> Update Alert Settings
        </button>
      </div>
    </div>
  );
}
