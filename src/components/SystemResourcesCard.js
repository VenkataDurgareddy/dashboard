import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import DnsIcon from "@mui/icons-material/Dns";
import SdStorageIcon from "@mui/icons-material/SdStorage";

const iconMap = {
  "CPU Usage": <MemoryIcon sx={{ color: "#fb923c" }} />,   // Orange
  "Memory Usage": <StorageIcon sx={{ color: "#3b82f6" }} />, // Blue
  "GPU Usage": <DnsIcon sx={{ color: "#10b981" }} />,       // Green
  "Disk Usage": <SdStorageIcon sx={{ color: "#a855f7" }} /> // Purple
};

const colorMap = {
  "CPU Usage": "#fb923c",
  "Memory Usage": "#3b82f6",
  "GPU Usage": "#10b981",
  "Disk Usage": "#a855f7"
};

const SystemResourcesCard = () => {
  const [resources, setResources] = useState([
    { name: "CPU Usage", value: 0 },
    { name: "Memory Usage", value: 0 },
    { name: "GPU Usage", value: 0 },
    { name: "Disk Usage", value: 0 }
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
    <Box p={3}
      bgcolor="white"
      borderRadius={3}
      boxShadow={3}
      flex={1}
      minWidth={320}
      display="flex"
      flexDirection="column"
      sx={{
        background: "linear-gradient(to bottom right, #f9fafb, #ffffff)",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 5 },
      }}>
       <Box display="flex" alignItems="center" gap={1} mb={2}>
        <MemoryIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>System Resources</Typography>
      </Box>
      <Box mt={2}>
        {resources.map((r, i) => (
          <Box key={i} mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                {iconMap[r.name]}
                <Typography variant="body2" fontWeight={500}>
                  {r.name}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={500}>
                {r.value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={r.value}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: colorMap[r.name]
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
