import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4caf50", "#aa0f0fff", "#ff9800", "#9c27b0", "#f44336", "#00bcd4", "#8bc34a"
];

export default function SuccessRateTrends({ metrics = [] }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!metrics || metrics.length === 0) return;

    const maxLength = Math.max(...metrics.map((m) => m.data.length));
    const combinedData = Array.from({ length: maxLength }, (_, i) => {
      const row = { time: `${i.toString().padStart(2, "0")}:00` };
      metrics.forEach((trend) => {
        row[trend.label] = trend.data[i] ?? 0;
      });
      return row;
    });


    setData(combinedData);
  }, [metrics]);

  return (
    <Card sx={{ flex: 1, minWidth: 200 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Success Rate Trends
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Success rates by operation type over time
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" interval={3} />
            <YAxis />
            <Tooltip />
            {metrics.map((trend, idx) => (
              <Line
                key={trend.label}
                type="monotone"
                dataKey={trend.label}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
