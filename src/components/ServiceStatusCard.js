import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const ServiceStatusCard = () => {
  const [services, setServices] = useState([]);

  const fetchServiceStatus = () => {
    fetch("http://localhost:8000/service-status")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services);
      })
      .catch((err) => console.error("Error fetching service status:", err));
  };

  useEffect(() => {
    fetchServiceStatus(); // Initial fetch
    const interval = setInterval(fetchServiceStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} flex={1} minWidth={250}>
      <Typography variant="h6" gutterBottom>Service Status</Typography>
      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        {services.map((svc, i) => (
          <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">{svc.name}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {svc.status === "Healthy" ? (
                <>
                  <CheckCircleIcon fontSize="small" color="success" />
                  <Typography variant="body2" color="success.main">Healthy</Typography>
                </>
              ) : (
                <>
                  <WarningAmberIcon fontSize="small" color="warning" />
                  <Typography variant="body2" color="warning.main">Warning</Typography>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ServiceStatusCard;
