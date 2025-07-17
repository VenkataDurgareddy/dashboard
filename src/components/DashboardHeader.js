import React, { useState, useEffect } from 'react';
import { RotateCcw, Download, Eye } from 'lucide-react';
import '../styles/dashboard_header.css';

export default function DashboardHeader({ selectedPeriod, setSelectedPeriod }) {
  const [isRotating, setIsRotating] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      triggerRefresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  const triggerRefresh = () => {
    setIsRotating(true);
    setLastRefreshTime(new Date());
    // console.log("Data refreshed at:", new Date().toLocaleTimeString());
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleRefreshToggle = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    if (!autoRefreshEnabled) {
      triggerRefresh();
    }
  };

  const handleExport = () => {
    console.log(`Exporting report for ${selectedPeriod}`);
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Left Section */}
        <div className="title-section">
          <div className="icon-circle">
            <Eye color="white" size={18} />
          </div>
          <div className="title-text">
            <h1>Face Recognition Dashboard</h1>
            <p>Real-time monitoring and analytics</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="controls">
          <button onClick={handleRefreshToggle} className="refresh-button">
            <RotateCcw size={16} className={isRotating ? 'spin' : ''} />
            Auto Refresh
          </button>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}  
            className="period-select"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <button onClick={handleExport} className="export-button">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>
    </header>
  );
}
