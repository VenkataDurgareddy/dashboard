import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";

const ServiceStatusCard = () => {
  const [services, setServices] = useState([]);

  const fetchServiceStatus = () => {
    fetch("http://localhost:8000/service-status")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .catch((err) => console.error("Error fetching service status:", err));
  };

  useEffect(() => {
    fetchServiceStatus();
    const interval = setInterval(fetchServiceStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      p={3}
      bgcolor="white"
      borderRadius={3}
      boxShadow={3}
      flex={1}
      minWidth={320}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        background: "linear-gradient(to bottom right, #f9fafb, #ffffff)",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 5 },
      }}
    >
      <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
        <BuildIcon sx={{ color: "#6366f1" }} />
        Service Status
      </Typography>
      <Divider sx={{ borderColor: "#e0e0e0" }} />

      {services.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No service data available.
        </Typography>
      ) : (
        services.map((svc, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={1.5}
            borderRadius={2}
            bgcolor="#f3f4f6"
            boxShadow="inset 0px 1px 3px rgba(0,0,0,0.04)"
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.01)" },
            }}
          >
            <Box display="flex" alignItems="center" gap={1.2}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: "#e0e7ff",
                  color: "#3730a3",
                  fontSize: 16,
                }}
              >
                <SettingsIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" fontWeight={500}>
                {svc.name}
              </Typography>
            </Box>

            <Tooltip title={svc.status} arrow>
              {svc.status === "Healthy" ? (
                <Chip
                  size="small"
                  icon={<CheckCircleIcon sx={{ color: "#15803d" }} />}
                  label="Healthy"
                  sx={{
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                    fontWeight: 600,
                    borderRadius: 2,
                    "& .MuiChip-icon": { marginLeft: 0.3 },
                  }}
                />
              ) : (
                <Chip
                  size="small"
                  icon={<WarningAmberIcon sx={{ color: "#b45309" }} />}
                  label="Warning"
                  sx={{
                    bgcolor: "#fef3c7",
                    color: "#b45309",
                    fontWeight: 600,
                    borderRadius: 2,
                    "& .MuiChip-icon": { marginLeft: 0.3 },
                  }}
                />
              )}
            </Tooltip>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ServiceStatusCard;
