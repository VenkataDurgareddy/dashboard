import React from "react";
import { Box, Typography } from "@mui/material";

const UserActivityCard = () => {
  return (
    <Box
      p={3}
      bgcolor="#fff"
      borderRadius={2}
      boxShadow={1}
      flex={1}
      minWidth={250}
    >
      <Typography variant="h6" gutterBottom>User Activity</Typography>
      <Typography variant="h4" fontWeight={700}>1,137</Typography>
      <Box mt={2}>
        <Typography variant="body2">Active Now</Typography>
        <Typography fontWeight={500} mb={1}>1,247</Typography>

        <Typography variant="body2">Today</Typography>
        <Typography fontWeight={500} mb={1}>5,432</Typography>

        <Typography variant="body2">This Week</Typography>
        <Typography fontWeight={500}>23,891</Typography>
      </Box>
    </Box>
  );
};

export default UserActivityCard;
