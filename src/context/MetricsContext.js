import React, { createContext, useContext, useEffect, useState } from "react";

const MetricsContext = createContext();

export const MetricsProvider = ({ children }) => {
  const [metrics, setMetrics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`https://007276ec2083.ngrok-free.app/api/stats?period=${selectedPeriod}`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      })
        .then((res) => res.json())
        .then((data) => setMetrics(data.metrics || data))
        .catch((err) => console.error("Failed to fetch metrics:", err));
    };

    fetchMetrics(); // initial call
    const interval = setInterval(fetchMetrics, 5000); // every 5 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, [selectedPeriod]);

  return (
    <MetricsContext.Provider value={{ metrics, selectedPeriod, setSelectedPeriod }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => useContext(MetricsContext);
