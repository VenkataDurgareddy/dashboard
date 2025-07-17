
import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const SystemResourcesCard = () => {
  const [resources, setResources] = useState([
    { name: "CPU Usage", value: 0 },
    { name: "Memory Usage", value: 0 },
    { name: "GPU Usage", value: 0 },
    { name: "Disk Usage", value: 0 },
  ]);

  const fetchResources = () => {
    fetch("http://localhost:8000/system-resources")
      .then(res => res.json())
      .then(data => {
        const updated = [
          { name: "CPU Usage", value: Math.round(data.cpu) },
          { name: "Memory Usage", value: Math.round(data.memory) },
          { name: "GPU Usage", value: Math.round(data.gpu) },
          { name: "Disk Usage", value: Math.round(data.disk) }
        ];
        setResources(updated);
      })
      .catch(err => console.error("Failed to fetch system resources:", err));
  };

  useEffect(() => {
    fetchResources();
    const interval = setInterval(fetchResources, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} flex={1} minWidth={250}>
      <Typography variant="h6" gutterBottom>System Resources</Typography>
      <Box mt={2}>
        {resources.map((r, i) => (
          <Box key={i} mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">{r.name}</Typography>
              <Typography variant="body2">{r.value}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={r.value}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f3f4f6",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: r.value > 80 ? "#f87171" : "#3b82f6"
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SystemResourcesCard;
