import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import DashboardHeader from "./DashboardHeader";
import StatsCards from './StatsCards';
import AnalyticsTabs from "./AnalyticsTabs";
import SuccessRateTrends from "./SuccessRateTrends";
import LatencyDistribution from "./LatencyDistribution";
import PerformanceAnalytics from "./PerformanceAnalytics";
import ProcessingDistributionChart from "./ProcessingDistributionChart";
import StatusCards from "./StatusCards";
import CachePerformanceCard from "./CachePerformanceCard";
import QueueStatusCard from "./QueueStatusCard";
import OperationCard from "./OperationCard";
import ProcessingQueue from "./ProcessingQueue";
import UserActivityCard from "./UserActivityCard";
import TopRegionsCard from "./TopRegionsCard";
import ApiUsageCard from "./ApiUsageCard";
import SystemResourcesCard from "./SystemResourcesCard";
import ServiceStatusCard from "./ServiceStatusCard";
import ModelPerformanceCard from "./ModelPerformanceCard";
import RequestVolume from "./RequestVolume";
import Alert from "./alert";
import HandleExport from "./HandleExport";

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  const exportRef = useRef();

  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`https://76d3e27e2822.ngrok-free.app/api/stats?period=${selectedPeriod}`, {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(`[${new Date().toLocaleTimeString()}] Metrics fetched:`, data);
          setMetrics(data);
        })
        .catch(err => console.error("Failed to load metrics:", err));
    };

    fetchMetrics();

    const intervalId = setInterval(fetchMetrics, 6000);
    return () => clearInterval(intervalId);
  }, [selectedPeriod]);

  return (
    <Box p={4} maxWidth="1245px" mx="auto">

      <DashboardHeader
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        exportRef={exportRef}
      />

      <StatsCards metrics={metrics} />
      <AnalyticsTabs tab={tab} setTab={setTab} />

      {tab === 0 && (
        <>
          <Box mt={3}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <RequestVolume metrics={metrics} />
              <ProcessingDistributionChart metrics={metrics} />
            </Box>
          </Box>

          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            <StatusCards
              metrics={metrics?.metrics}
              queue_summary={metrics?.queue_summary}
              cache_performance={metrics?.cache_performance}
              summary_metrics={metrics?.summary_metrics}
            />
          </Box>

          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            <OperationCard
              title="Verification"
              subtitle="1:1 face match"
              count={metrics?.metrics?.face_verification_tasks ?? "---"}
              success={metrics?.metrics?.face_verification_success}
              failed={metrics?.metrics?.face_verification_failed}
              successRate={metrics?.metrics?.face_verification_success_rate ?? null}
              color="success"
            />
            <OperationCard
              title="Deduplication"
              subtitle="1:N face match"
              count={metrics?.metrics?.face_deduplication_tasks ?? "---"}
              success={metrics?.metrics?.face_deduplication_success}
              failed={metrics?.metrics?.face_deduplication_failed}
              successRate={metrics?.metrics?.face_deduplication_success_rate ?? null}
              color="success"
            />
            <OperationCard
              title="MRZ Parsed"
              subtitle="MRZ Extraction"
              count={metrics?.metrics?.mrz_parsing_tasks ?? "---"}
              success={metrics?.metrics?.mrz_success}
              failed={metrics?.metrics?.mrz_failed}
              successRate={metrics?.metrics?.mrz_success_rate ?? null}
              color="info"
            />
            <OperationCard
              title="Liveness"
              subtitle="Anti-spoofing"
              count={metrics?.metrics?.face_liveness_tasks ?? "---"}
              success={metrics?.metrics?.face_liveness_sucess}
              failed={metrics?.metrics?.face_liveness_failed}
              successRate={metrics?.metrics?.face_liveness_success_rate ?? null}
              color="warning"
            />
          </Box>
        </>
      )}

      {tab === 1 && (
        <Box mt={3}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Box flex={1} minWidth={300}>
              <SuccessRateTrends metrics={metrics?.success_trends || []} />
            </Box>
            <Box flex={1} minWidth={300}>
              <LatencyDistribution metrics={metrics?.latency_distribution || []} />
            </Box>
          </Box>
          <PerformanceAnalytics />
        </Box>
      )}

      {tab === 2 && (
        <>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            <OperationCard
              title="Verification"
              subtitle="1:1 face match"
              count={metrics?.metrics?.face_verification_tasks ?? "---"}
              success={metrics?.metrics?.face_verification_success}
              failed={metrics?.metrics?.face_verification_failed}
              successRate={metrics?.metrics?.face_verification_success_rate ?? null}
              color="success"
            />
            <OperationCard
              title="Deduplication"
              subtitle="1:N face match"
              count={metrics?.metrics?.face_deduplication_tasks ?? "---"}
              success={metrics?.metrics?.face_deduplication_success}
              failed={metrics?.metrics?.face_deduplication_failed}
              successRate={metrics?.metrics?.face_deduplication_success_rate ?? null}
              color="success"
            />
            <OperationCard
              title="MRZ Parsed"
              subtitle="MRZ Extraction"
              count={metrics?.metrics?.mrz_parsing_tasks ?? "---"}
              success={metrics?.metrics?.mrz_success}
              failed={metrics?.metrics?.mrz_failed}
              successRate={metrics?.metrics?.mrz_success_rate ?? null}
              color="info"
            />
            <OperationCard
              title="Liveness"
              subtitle="Anti-spoofing"
              count={metrics?.metrics?.face_liveness_tasks ?? "---"}
              success={metrics?.metrics?.face_liveness_sucess}
              failed={metrics?.metrics?.face_liveness_failed}
              successRate={metrics?.metrics?.face_liveness_success_rate ?? null}
              color="warning"
            />
          </Box>

          <Box mt={4}>
            {metrics ? (
              <ProcessingQueue metrics={metrics} />
            ) : (
              <Typography variant="body2" color="text.secondary" mt={2}>
                No processing data available.
              </Typography>
            )}
          </Box>
        </>
      )}

      {tab === 3 && (
        <Box mt={3} display="flex" gap={2} flexWrap="wrap">
          <UserActivityCard metrics={metrics} />
          <ApiUsageCard metrics={metrics}/>
        </Box>
      )}

      {tab === 4 && (
        <Box mt={3} display="flex" gap={2} flexWrap="wrap">
          <SystemResourcesCard />
          <ServiceStatusCard />
          <ModelPerformanceCard />
        </Box>
      )}

      {tab === 5 && (
        <Box mt={3} display="flex" gap={2} flexWrap="wrap">
          <Alert />
        </Box>
      )}
      <HandleExport exportRef={exportRef} metrics={metrics} />


    </Box>
  );
}
