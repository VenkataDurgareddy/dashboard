import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

const statusColors = {
  processing: { label: "Processing", color: "#0284c7", bg: "#e0f2fe" },
  completed: { label: "Completed", color: "#16a34a", bg: "#dcfce7" },
  pending: { label: "Pending", color: "#6b7280", bg: "#f3f4f6" },
  failed: { label: "Failed", color: "#dc2626", bg: "#fee2e2" },
};

const ProcessingQueue = ({ metrics }) => {
  if (!metrics) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  const queueSummary = metrics.queue_summary || {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  };

  const jobTable = metrics.job_table || [];

  const getStatusColor = (status) =>
    statusColors[status] || {
      label: status,
      color: "#6b7280",
      bg: "#f3f4f6",
    };

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Processing Queue
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Current queue status and recent jobs
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mt={2} mb={3} flexWrap="wrap">
        <SummaryCard
          label="Pending"
          value={queueSummary.pending}
          bg="#e0e7ff"
          color="#1e3a8a"
        />
        <SummaryCard
          label="Processing"
          value={queueSummary.processing}
          bg="#fef3c7"
          color="#92400e"
        />
        <SummaryCard
          label="Completed"
          value={queueSummary.completed}
          bg="#d1fae5"
          color="#065f46"
        />
        <SummaryCard
          label="Failed"
          value={queueSummary.failed}
          bg="#fecaca"
          color="#7f1d1d"
        />
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
            <TableRow>
              {["Job ID", "Type", "Status", "Progress", "Duration"].map(
                (heading, index) => (
                  <TableCell key={index}>
                    <Typography variant="body2" fontWeight="bold">
                      {heading}
                    </Typography>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {jobTable.map((job) => {
              const status = job.status.toLowerCase();
              const progressValue = parseInt(job.progress.replace("%", ""));
              const statusData = getStatusColor(status);

              return (
                <TableRow
                  key={job.job_id}
                  hover
                  sx={{ transition: "background 0.2s" }}
                >
                  <TableCell>{job.job_id}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusData.label}
                      size="small"
                      sx={{
                        color: statusData.color,
                        backgroundColor: statusData.bg,
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress
                        variant={
                          progressValue > 0 ? "determinate" : "buffer"
                        }
                        value={progressValue}
                        sx={{
                          width: 100,
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              status === "failed"
                                ? "#dc2626"
                                : progressValue > 95
                                ? "#10b981"
                                : "#3b82f6",
                          },
                        }}
                      />
                      <Typography variant="body2" minWidth={40}>
                        {job.progress}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{job.duration}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Summary card component
const SummaryCard = ({ label, value, bg, color }) => (
  <Box
    flex={1}
    minWidth={180}
    bgcolor={bg}
    borderRadius={2}
    p={2}
    textAlign="center"
    boxShadow={1}
  >
    <Typography variant="h5" fontWeight="bold" sx={{ color }}>
      {value}
    </Typography>
    <Typography
      variant="body2"
      color="black" 
      sx={{ mt: 0.5 }}
    >
      {label}
    </Typography>
  </Box>
);

export default ProcessingQueue;
