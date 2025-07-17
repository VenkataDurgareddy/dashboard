import React, { useEffect, useState } from 'react';
import '../styles/PerformanceAnalytics.css';

const PerformanceAnalytics = () => {
  const [resources, setResources] = useState({
    cpu: 0,
    memory: 0,
    gpu: 0
  });

  useEffect(() => {
  const fetchResources = () => {
    fetch("http://localhost:8000/system-resources")
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error("Failed to fetch system resources", err));
  };

  fetchResources(); 

  const intervalId = setInterval(fetchResources, 5000); 

  return () => clearInterval(intervalId); 
}, []);


  const data = {
    'Response Times': [
      { label: 'P50', value: '0.8s' },
      { label: 'P95', value: '2.1s' },
      { label: 'P99', value: '4.2s' },
    ],
    'Error Rates': [
      { label: '4xx Errors', value: '0.8%' },
      { label: '5xx Errors', value: '0.3%' },
      { label: 'Timeouts', value: '0.2%' },
    ],
    'Throughput': [
      { label: 'Requests/sec', value: '245' },
      { label: 'Peak RPS', value: '412' },
      { label: 'Daily Total', value: '2.1M' },
    ],
    'Resource Usage': [
      { label: 'CPU Usage', value: `${resources.cpu}%` },
      { label: 'Memory Usage', value: `${resources.memory}%` },
      { label: 'GPU Usage', value: `${resources.gpu}%` },
    ],
  };

  return (
    <div className="perf-analytics-card">
      <h3>Performance Analytics</h3>
      <p className="subtitle">Detailed breakdown of system performance metrics</p>
      <div className="perf-grid">
        {Object.entries(data).map(([title, items]) => (
          <div className="perf-column" key={title}>
            <h4>{title}</h4>
            <ul>
              {items.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
