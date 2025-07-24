import React, { useEffect, useState } from "react";
import "../styles/alert.css";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Alert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = () => {
      fetch("http://localhost:8000/alerts")
        .then((res) => res.json())
        .then((data) => setAlerts(data.alerts))
        .catch((err) => console.error("Failed to fetch alerts:", err));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alert-container">
      {/* Active Alerts */}
      <div className="alert-card">
        <h2 className="section-title">🚨 Active Alerts</h2>
        <p className="section-subtitle">Critical system issues needing immediate attention</p>

        {alerts.length === 0 ? (
          <div className="no-alerts">✅ No active alerts at the moment</div>
        ) : (
          alerts.map((alert, index) => (
            <div key={index} className="alert-box">
              <div className="alert-content">
                <WarningAmberIcon className="alert-icon" />
                <div>
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-description">{alert.description}</div>
                </div>
              </div>
              <div className="alert-time">{alert.time}</div>
            </div>
          ))
        )}
      </div>

      {/* Alert Configuration */}
      <div className="alert-card">
        <h2 className="section-title">🛠 Alert Configuration</h2>
        <p className="section-subtitle">Set thresholds for system monitoring and notifications</p>

        <div className="config-row">
          <label>Error Rate Threshold</label>
          <input type="number" defaultValue={5} /> %
        </div>
        <div className="config-row">
          <label>Response Time Threshold</label>
          <input type="number" defaultValue={3} /> sec
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
          <SettingsIcon className="gear-icon" />
          Update Alert Settings
        </button>
      </div>
    </div>
  );
}
