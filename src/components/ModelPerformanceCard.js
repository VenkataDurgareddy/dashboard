import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Tooltip } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import SpeedIcon from "@mui/icons-material/Speed";
import BarChartIcon from "@mui/icons-material/BarChart";

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

  const getBarColor = (accuracy) => {
    if (accuracy > 95) return "#10b981"; // green
    if (accuracy > 80) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <Box
      p={3}
      bgcolor="#fff"
      borderRadius={2}
      boxShadow={3}
      flex={1}
      minWidth={300}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        <BarChartIcon sx={{ mb: "-5px", mr: 1, color: "#6366f1" }} />
        Model Performance
      </Typography>

      <Box mt={1} display="flex" flexDirection="column" gap={2}>
        {models.map((model, i) => (
          <Box key={i} sx={{ transition: "all 0.3s" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0.5}
            >
              <Typography variant="body2" fontWeight={500}>
                {model.name}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Accuracy">
                  <InsightsIcon fontSize="small" sx={{ color: "#10b981" }} />
                </Tooltip>
                <Typography variant="caption" fontWeight={500}>
                  {model.accuracy}%
                </Typography>

                <Tooltip title="Latency">
                  <SpeedIcon fontSize="small" sx={{ color: "#3b82f6" }} />
                </Tooltip>
                <Typography variant="caption" fontWeight={500}>
                  {model.latency}
                </Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={model.accuracy}
              sx={{
                height: 10,
                borderRadius: 4,
                transition: "all 0.8s ease",
                backgroundColor: "#f3f4f6",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getBarColor(model.accuracy),
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ModelPerformanceCard;
