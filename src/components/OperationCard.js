import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ShieldCheck,
  Search,
  Users,
  Camera,
  ScanLine,
  UserCheck,
} from "lucide-react";

const iconMap = {
  Verification: <ShieldCheck size={18} color="#2563eb" />,
  Identification: <Search size={18} color="#22c55e" />,
  Deduplication: <Users size={18} color="#fbbf24" />,
  Liveness: <Camera size={18} color="#ef4444" />,
  "MRZ Parsed": <ScanLine size={18} color="#0ea5e9" />,
  "KYC Match": <UserCheck size={18} color="#9333ea" />,
};

export default function OperationCard({
  title,
  subtitle,
  count,
  successRate,
}) {
  const icon = iconMap[title];

  return (
    <Card
      elevation={0}
      sx={{
        flex: "1 1 240px",          
        minWidth: 240,               
        maxWidth: "100%",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        p: 1.5,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header with Icon and Title */}
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          {icon}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontSize: "0.85rem" }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Count */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          {(count ?? 0).toLocaleString()}
        </Typography>

        {/* Success Rate Label */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="body2"
            sx={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            Success Rate
          </Typography>

          <Chip
            label={`${(successRate ?? 0).toFixed(1)}%`}
            size="small"
            sx={{
              backgroundColor: "#d1fae5", // Tailwind green-100
              color: "#047857", // Tailwind green-700
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 22,
              borderRadius: "12px",
            }}
          />
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={successRate ?? 0}
          sx={{
            mt: 1,
            height: 8,
            borderRadius: 10,
            backgroundColor: "#e5e7eb", // gray-200
            [`& .MuiLinearProgress-bar`]: {
              backgroundColor: "#047857",
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
