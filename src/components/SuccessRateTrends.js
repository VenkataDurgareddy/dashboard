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

export default function SuccessRateTrends({ selectedPeriod = "24h" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://007276ec2083.ngrok-free.app/api/stats?period=${selectedPeriod}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json.success_rate_trends || []);
      })
      .catch((err) => {
        console.error("Failed to fetch success rate trends:", err);
      });
  }, [selectedPeriod]);

  return (
    <Card sx={{ flex: 1, minWidth: 350 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Success Rate Trends
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Success rates by operation type over time
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="success" stroke="#4caf50" />
            <Line type="monotone" dataKey="error" stroke="#f44336" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
