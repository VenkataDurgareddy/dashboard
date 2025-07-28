import React, { useEffect, useState } from "react";
import "../styles/alert.css";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Alert() {
  const [alerts, setAlerts] = useState([]);
  const [config, setConfig] = useState({
    memory_threshold: '',
    cpu_threshold: '',
    disk_threshold: '',
  });

  // Handle input change
  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // Submit updated config to backend
  const updateSettings = () => {
    fetch("http://localhost:8000/alerts/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
      .then((res) => res.json())
      .then((data) => console.log("Config updated", data))
      .catch((err) => console.error("Failed to update config", err));
  };

  // Fetch config once on component mount
  useEffect(() => {
    fetch("http://localhost:8000/alerts/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Failed to fetch alert config:", err));
  }, []);

  // Fetch alerts every 5 seconds
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
      <div className="alert-cards-wrapper">
        {/* Active Alerts */}
        <div className="alert-card">
          <h2 className="section-title">🚨 Active Alerts</h2>
          <p className="section-subtitle">
            Critical system issues needing immediate attention
          </p>

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
          <p className="section-subtitle">Set thresholds for system alerts</p>

          <div className="config-row">
            <label>Memory Threshold (%)</label>
            <input
              type="number"
              value={config.memory_threshold}
              onChange={(e) => handleConfigChange("memory_threshold", e.target.value)}
            />
          </div>

          <div className="config-row">
            <label>CPU Threshold (%)</label>
            <input
              type="number"
              value={config.cpu_threshold}
              onChange={(e) => handleConfigChange("cpu_threshold", e.target.value)}
            />
          </div>

          <div className="config-row">
            <label>Disk Threshold (%)</label>
            <input
              type="number"
              value={config.disk_threshold}
              onChange={(e) => handleConfigChange("disk_threshold", e.target.value)}
            />
          </div>

          <button onClick={updateSettings} className="update-btn-alert">
            <SettingsIcon className="gear-icon" />
            Update Alert Settings
          </button>
        </div>
      </div>
    </div>
  );
}
