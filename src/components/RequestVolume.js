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
  Legend,
} from "recharts";
import "../styles/requestChart.css";

// Combine request and success data into a single array
function formatHourlyData(requests, successes) {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i.toString().padStart(2, "0")}:00`,
      requests: requests?.[i] || 0,
      successes: successes?.[i] || 0,
    });
  }
  return data;
}

export default function RequestVolume({ metrics }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (
      metrics &&
      Array.isArray(metrics.request_volume) &&
      Array.isArray(metrics.success_volume)
    ) {
      const formatted = formatHourlyData(metrics.request_volume, metrics.success_volume);
      setData(formatted);
    } else {
      setData([]);
    }
  }, [metrics]);

  return (
    <Card className="request-card" sx={{ flex: 1, minWidth: 300 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Request & Success Volume
        </Typography>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Per hour (last period)
        </Typography>

        <div className="chart-wrapper_re">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                ticks={["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]}
              />

              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#1976d2"
                fill="#90caf9"
                name="Requests"
              />
              <Area
                type="monotone"
                dataKey="successes"
                stroke="#2e7d32"
                fill="#a5d6a7"
                name="Successes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
