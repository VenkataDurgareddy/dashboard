import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const ApiUsageCard = () => {
  const [apis, setApis] = useState([]);

  const fetchApiUsage = () => {
    fetch("http://localhost:8000/api-call-stats")
      .then((res) => res.json())
      .then((data) => setApis(data.apis || []))
      .catch((err) => console.error("Failed to fetch API usage:", err));
  };

  useEffect(() => {
    fetchApiUsage();
    const interval = setInterval(fetchApiUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxCount = Math.max(...apis.map((api) => api.count), 1); // Avoid divide by zero

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} flex={1} minWidth={300}>
      <Typography variant="h6" gutterBottom>API Usage</Typography>
      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {apis.map((api, index) => (
          <Box key={index}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">{api.path}</Typography>
              <Typography variant="body2" fontWeight={500}>
                {api.count.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(api.count / maxCount) * 100}
              sx={{ height: 8, borderRadius: 4, mt: 0.5, backgroundColor: "#f3f4f6" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ApiUsageCard;
