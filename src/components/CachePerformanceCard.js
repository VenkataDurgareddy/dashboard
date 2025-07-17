import React from "react";
import { Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

export default function CachePerformanceCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">Cache Performance</Typography>
        <Typography variant="h5" fontWeight={700}>92.9%</Typography>
        <Box mt={1} mb={1}>
          <LinearProgress variant="determinate" value={92.9} sx={{ height: 8, borderRadius: 5 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">Hit Rate: 92.9%</Typography>
        <Typography variant="body2" color="text.secondary">Miss Rate: 7.1%</Typography>
      </CardContent>
    </Card>
  );
}