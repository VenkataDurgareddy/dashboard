import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function QueueStatusCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">Queue Status</Typography>
        <Typography variant="h5" fontWeight={700}>3</Typography>
        <Typography variant="body2" color="text.secondary">jobs pending</Typography>
        <Typography variant="body2" color="text.secondary">Processing: 12</Typography>
        <Typography variant="body2" color="text.secondary">Completed Today: 8,934</Typography>
      </CardContent>
    </Card>
  );
}
