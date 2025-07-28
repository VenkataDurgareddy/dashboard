import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import {
  ShieldCheck,
  Search,
  Users,
  Camera,
  ScanLine,
} from "lucide-react";

// Icon map for API types
const apiIcons = {
  face_liveness_api: <Camera size={16} color="#f43f5e" />,         
  face_verification_api: <ShieldCheck size={16} color="#10b981" />, 
  face_deduplication_api: <Users size={16} color="#f59e0b" />,      
  mrz_api: <ScanLine size={16} color="#6366f1" />,                
};

// Color gradient map
const apiGradients = {
  face_liveness_api: "linear-gradient(to right, #ff6a7f, #ffb347)",
  face_verification_api: "linear-gradient(to right, #34d399, #06b6d4)",
  face_deduplication_api: "linear-gradient(to right, #fbbf24, #f87171)",
  mrz_api: "linear-gradient(to right, #a78bfa, #60a5fa)",
};

const ApiUsageCard = ({ metrics }) => {
  const apiUsage = metrics?.api_usage ?? {};

  const apis = Object.entries(apiUsage).map(([path, count]) => ({
    path,
    count,
  }));

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} flex={1} minWidth={300}>
      <Typography variant="h6" gutterBottom>
        API Usage
      </Typography>

      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {apis.map((api, index) => {
          const gradient = apiGradients[api.path] || "linear-gradient(to right, #60a5fa, #3b82f6)";

          return (
            <Box key={index}>
              {/* Label Row */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  {apiIcons[api.path] || <Search size={16} color="#6b7280" />}
                  <Typography variant="body2">
                    {api.path.replace(/_/g, " ").replace(/api/i, "").trim()}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {api.count.toLocaleString()}
                </Typography>
              </Box>

              {/* Gradient Progress Bar */}
              {/* Solid Color Progress Bar */}
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 0.5,
                  backgroundColor: "#e5e7eb", 
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${Math.min(api.count, 100)}%`,
                    height: "100%",
                    backgroundColor: "#047857", 
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              </Box>

            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ApiUsageCard;
