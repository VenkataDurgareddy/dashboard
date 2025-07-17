import React from "react";
import { Box, Typography, Stack } from "@mui/material";

const regions = [
  { name: "North America", color: "#3b82f6", percent: "45.2%" },
  { name: "Europe", color: "#22c55e", percent: "28.7%" },
  { name: "Asia Pacific", color: "#facc15", percent: "18.3%" },
  { name: "Others", color: "#6b7280", percent: "7.8%" },
];

const TopRegionsCard = () => {
  return (
    <Box
      p={3}
      bgcolor="#fff"
      borderRadius={2}
      boxShadow={1}
      flex={1}
      minWidth={250}
    >
      <Typography variant="h6" gutterBottom>Top Regions</Typography>
      <Stack spacing={1} mt={2}>
        {regions.map((region, index) => (
          <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={10} height={10} borderRadius="50%" bgcolor={region.color} />
              <Typography variant="body2">{region.name}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>{region.percent}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TopRegionsCard;
