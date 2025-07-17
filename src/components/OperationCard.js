import React from "react";
import { Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

export default function OperationCard({
  title,
  subtitle,
  count,
  successRate,
  color,
  onClick,
}) {
  return (
    <Card onClick={onClick} sx={{ cursor: "pointer", flex: 1, minWidth: 250 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        <Typography variant="h6" fontWeight={700}>
          {(count ?? 0).toLocaleString()}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Success Rate
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <LinearProgress
            variant="determinate"
            value={successRate ?? 0}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 5,
              [`& .MuiLinearProgress-bar`]: {
                backgroundColor: `${color}.main`,
              },
            }}
          />
          <Typography variant="body2" color={`${color}.main`} fontWeight={600}>
            {(successRate ?? 0).toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ✅ Default props to avoid undefined issues
OperationCard.defaultProps = {
  title: "Operation",
  subtitle: "",
  count: 0,
  successRate: 0,
  color: "success",
  onClick: () => {},
};
