import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "../styles/processing_chart.css";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#FF6D00", "#9C27B0"];
const RADIAN = Math.PI / 180;

export default function ProcessingDistributionChart({ metrics }) {
  const data = metrics?.processing_distribution || [];

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const radius = outerRadius +9;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
      >
        {`${data[index]?.label} ${percent > 0 ? (percent * 100).toFixed(1) + "%" : ""}`}
      </text>
    );
  };

  return (
    <Card className="processing-card">
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Processing Distribution
        </Typography>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Breakdown by operation type
        </Typography>
        <div className="chart-wrapper">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="label"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
