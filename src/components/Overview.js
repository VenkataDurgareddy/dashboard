import React, { useState } from "react";
import { Box } from "@mui/material";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import AnalyticsTabs from "./AnalyticsTabs";
import Overview from "./Overview";
import SuccessRateTrends from "./SuccessRateTrends";
import LatencyDistribution from "./LatencyDistribution";
import PerformanceAnalytics from "./PerformanceAnalytics";

export default function Dashboard() {
  const [tab, setTab] = useState(0); // 0 = Overview, 1 = Analytics, etc.
  const [filter, setFilter] = useState(null); // For cross-screen interaction

  return (
    <Box p={4}>
      <DashboardHeader />
      <StatsCards />
      <AnalyticsTabs tab={tab} setTab={setTab} />
      {tab === 0 && <Overview setFilter={setFilter} />}
      {tab === 1 && (
        <Box mt={3}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <SuccessRateTrends filter={filter} />
            <LatencyDistribution filter={filter} />
          </Box>
          <PerformanceAnalytics filter={filter} />
        </Box>
      )}
    </Box>
  );
}
