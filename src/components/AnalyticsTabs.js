import React from "react";
import { Tabs, Tab, Box, useMediaQuery } from "@mui/material";
import "../styles/analytics_tab.css";

const tabLabels = [
  "Overview",
  "Analytics",
  "Processing",
  "Users",
  "System",
  "Alerts"
];

export default function AnalyticsTabs({ tab, setTab }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box className="tabs-container" mt={3}>
      {!isMobile ? (
        <Tabs
          value={tab} // 👈 this is the current index
          onChange={(_, newIndex) => setTab(newIndex)}
          TabIndicatorProps={{ style: { display: "none" } }}
          className="custom-tabs"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} className="custom-tab" />
          ))}
        </Tabs>
      ) : (
        <select
          value={tab}
          onChange={(e) => setTab(Number(e.target.value))}
          className="tabs-dropdown"
        >
          {tabLabels.map((label, index) => (
            <option key={index} value={index}>
              {label}
            </option>
          ))}
        </select>
      )}
    </Box>
  );
}
