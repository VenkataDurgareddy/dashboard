import React, { useEffect, useState } from "react";
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
  CircularProgress
} from "@mui/material";

const statusColors = {
  processing: { label: "Processing", color: "info" },
  completed: { label: "Completed", color: "success" },
  pending: { label: "Pending", color: "default" },
  failed: { label: "Failed", color: "error" },
};

const ProcessingQueue = ({selectedPeriod}) => {
  const [loading, setLoading] = useState(true);
  const [queueSummary, setQueueSummary] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });
  const [jobTable, setJobTable] = useState([]);

  useEffect(() => {
  setLoading(true); // Important: reset loading when fetching new data
  fetch(`https://007276ec2083.ngrok-free.app/api/stats?period=${selectedPeriod}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json"
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setJobTable(data.job_table || []);
      setQueueSummary(data.queue_summary || {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0
      });
      setLoading(false); // ✅ Stop showing spinner
    })
    .catch((err) => {
      console.error("Failed to load metrics:", err);
      setLoading(false);
    });
}, [selectedPeriod]);


  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  const getStatusColor = (status) => statusColors[status] || { label: status, color: "default" };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Processing Queue
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Current queue status and recent jobs
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mt={2} mb={3} flexWrap="wrap">
        <SummaryCard label="Pending" value={queueSummary.pending} bg="#eef2ff" color="primary" />
        <SummaryCard label="Processing" value={queueSummary.processing} bg="#fefce8" color="warning.main" />
        <SummaryCard label="Completed" value={queueSummary.completed} bg="#ecfdf5" color="success.main" />
        <SummaryCard label="Failed" value={queueSummary.failed} bg="#fef2f2" color="error.main" />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Job ID</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Progress</strong></TableCell>
              <TableCell><strong>Duration</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobTable.map((job) => {
              const status = job.status.toLowerCase();
              const progressValue = parseInt(job.progress.replace("%", ""));
              const statusData = getStatusColor(status);

              return (
                <TableRow key={job.job_id}>
                  <TableCell>{job.job_id}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusData.label}
                      color={statusData.color}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress
                        variant={progressValue > 0 ? "determinate" : "buffer"}
                        value={progressValue}
                        sx={{ width: "100px", height: 8, borderRadius: 4 }}
                        color={status === "failed" ? "error" : "primary"}
                      />
                      <Typography variant="body2">{job.progress}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{job.duration}</TableCell>
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
  >
    <Typography variant="h6" sx={{ color }}>{value}</Typography>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
  </Box>
);

export default ProcessingQueue;
