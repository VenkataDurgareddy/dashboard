import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function LatencyDistribution({ selectedPeriod }) {
  const [latencyData, setLatencyData] = useState([]);

  useEffect(() => {
    fetch(`https://007276ec2083.ngrok-free.app/api/stats?period=${selectedPeriod}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const raw = data.latency_distribution || [];
        const formatted = raw.map((latency, hour) => ({
          time: `${String(hour).padStart(2, "0")}:00`,
          latency,
        }));
        setLatencyData(formatted);
      })
      .catch((err) => console.error("Failed to fetch latency distribution:", err));
  }, [selectedPeriod]);

  return (
    <Card sx={{ flex: 1, minWidth: 350 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Latency Distribution
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Average processing time by hour
        </Typography>
        <BarChart width={350} height={200} data={latencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            interval={0} 
            angle={-45} 
            textAnchor="end" 
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="latency" fill="#3f51b5" />
        </BarChart>
      </CardContent>
    </Card>
  );
}
