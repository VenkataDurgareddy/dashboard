import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import DashboardHeader from "./DashboardHeader";
import StatsCards from './StatsCards';
import AnalyticsTabs from "./AnalyticsTabs";
import SuccessRateTrends from "./SuccessRateTrends";
import LatencyDistribution from "./LatencyDistribution";
import PerformanceAnalytics from "./PerformanceAnalytics";
import RequestVolumeChart from "./RequestVolumeChart";
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
import Alert from "./alert";


export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`https://007276ec2083.ngrok-free.app/api/stats?period=${selectedPeriod}`, {
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
    <Box p={4}>
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod} />
      <StatsCards metrics={metrics} />
      <AnalyticsTabs tab={tab} setTab={setTab} />
      {tab === 0 && (
        <>
          {/* Charts */}
          <Box mt={3}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <RequestVolumeChart metrics={metrics} />
              <ProcessingDistributionChart metrics={metrics} />
            </Box>
          </Box>

          {/* Info Cards */}
          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            {metrics && (
              <StatusCards
                metrics={metrics.metrics}
                queue_summary={metrics.queue_summary}
                cache_performance={metrics.cache_performance}
              />
            )}



          </Box>

          {/* Operation Cards Section */}
          {metrics && (
            <Box display="flex" gap={2} mt={3} flexWrap="wrap">
              <OperationCard
                title="Verification"
                subtitle="1:1 face match"
                count={metrics.face_verification_tasks}
                successRate={metrics.face_verification_success_rate}
                color="success"
              />
              <OperationCard
                title="MRZ Parsed"
                subtitle="MRZ Extraction"
                count={metrics.mrz_parsing_tasks}
                successRate={metrics.mrz_success_rate}
                color="info"
              />
              <OperationCard
                title="Liveness"
                subtitle="Anti-spoofing"
                count={metrics.face_liveness_tasks}
                successRate={metrics.face_liveness_success_rate}
                color="warning"
              />
            </Box>
          )}

        </>
      )}


      {tab === 1 && (
        <Box mt={3}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <SuccessRateTrends selectedPeriod={selectedPeriod} />

            <LatencyDistribution />
          </Box>
          <PerformanceAnalytics />
        </Box>
      )}



      {tab === 2 && metrics && (
        <>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            <OperationCard
              title="Verification"
              subtitle="1:1 face match"
              count={metrics.face_verification_tasks}
              successRate={metrics.face_verification_success_rate}
              color="success"
            />
            <OperationCard
              title="MRZ Parsed"
              subtitle="MRZ Extraction"
              count={metrics.mrz_parsing_tasks}
              successRate={metrics.mrz_success_rate}
              color="info"
            />
            <OperationCard
              title="Liveness"
              subtitle="Anti-spoofing"
              count={metrics.face_liveness_tasks}
              successRate={metrics.face_liveness_success_rate}
              color="warning"
            />
          </Box>
          <Box>
            <ProcessingQueue selectedPeriod={selectedPeriod} />
          </Box>
        </>
      )}


      {tab === 3 && (
        <Box mt={3} display="flex" gap={2} flexWrap="wrap">
          <UserActivityCard />
          {/* <TopRegionsCard /> */}
          <ApiUsageCard />
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

    </Box>


  );
}