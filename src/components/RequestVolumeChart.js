import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/requestChart.css";

// Convert raw hourly counts to { time, requests } objects
function formatHourlyData(rawCounts) {
  return rawCounts.map((count, index) => ({
    time: `${index.toString().padStart(2, "0")}:00`,
    requests: count,
  }));
}

export default function RequestVolumeChart({ metrics }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("📊 Metrics received in RequestVolumeChart:", metrics);

    if (metrics && Array.isArray(metrics.request_volume)) {
      const formatted = formatHourlyData(metrics.request_volume);
      setData(formatted);
    } else {
      console.warn("⚠️ No valid request_volume data found in metrics.");
      setData([]);
    }
  }, [metrics]);

  return (
    <Card className="request-card">
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Request Volume
        </Typography>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Requests per hour (last period)
        </Typography>

        <div className="chart-wrapper_re">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#1976d2"
                fill="#90caf9"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
