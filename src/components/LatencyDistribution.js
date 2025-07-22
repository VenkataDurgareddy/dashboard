import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function LatencyDistribution({ metrics }) {
  // Format incoming data
  const latencyData = Array.isArray(metrics)
    ? metrics.map((value, index) => ({
        time: `${index}:00`,
        latency: value,
      }))
    : [];

  const isAllZero =
    latencyData.length > 0 &&
    latencyData.every((item) => item.latency === 0);

  const isLoading = metrics === undefined;

  return (
    <Card sx={{ flex: 1, minWidth: 300 ,height:345}}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Latency Distribution
        </Typography>
        <Typography variant="caption" color="text.secondary" mb={2}>
          Average processing time by hour
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={30} />
          </Box>
        ) : isAllZero ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mt={2}
          >
            No latency data available for the selected period.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="latency"
                isAnimationActive
                animationDuration={800}
              >
                {latencyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.latency > 100 ? "#f43f5e" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
