import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Users, Activity, CalendarDays,CalendarClock } from "lucide-react";

const UserActivityCard = ({ metrics }) => {
  const activeNow = metrics?.metrics?.active_users ?? 0;
  const today = metrics?.summary_metrics?.completed_today ?? 0;
  const thisWeek = metrics?.metrics?.total_jobs ?? 0;

  const cardData = [
    { label: "Active Now", value: activeNow, icon: <Activity size={18} color="#22c55e" /> }, 
    { label: "Today", value: today, icon: <CalendarDays size={18} color="#f97316" /> }, 
    { label: "This Week", value: thisWeek, icon: <CalendarClock size={18} color="#3b82f6" /> }, 
  ];

  return (
    <Box
      p={3}
      bgcolor="#fff"
      borderRadius={2}
      boxShadow={1}
      flex={1}
      minWidth={260}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        User Activity
      </Typography>

      <Typography variant="h3" fontWeight={700} color="primary" mb={2}>
        {thisWeek.toLocaleString()}
      </Typography>

      <Stack spacing={1.5}>
        {cardData.map((item, index) => (
          <Box key={index} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              {item.icon}
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
            </Box>
            <Typography fontWeight={600}>{item.value.toLocaleString()}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default UserActivityCard;
