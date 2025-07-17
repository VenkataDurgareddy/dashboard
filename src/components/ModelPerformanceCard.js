import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const ModelPerformanceCard = () => {
  const [models, setModels] = useState([]);

  const fetchModelPerformance = () => {
    fetch("http://localhost:8000/model-performance")
      .then((res) => res.json())
      .then((data) => setModels(data.models))
      .catch((err) => console.error("Failed to fetch model performance:", err));
  };

  useEffect(() => {
    fetchModelPerformance();
    const interval = setInterval(fetchModelPerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} flex={1} minWidth={300}>
      <Typography variant="h6" gutterBottom>Model Performance</Typography>
      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {models.map((model, i) => (
          <Box key={i}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">{model.name}</Typography>
              <Typography variant="body2" fontWeight={500}>
                {model.accuracy}% / {model.latency}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={model.accuracy}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f3f4f6",
                mt: 0.5,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: model.accuracy > 97 ? "#10b981" : "#f59e0b"
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ModelPerformanceCard;
