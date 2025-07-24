import React from "react";
import "../styles/stats_card.css";
import { Activity, RefreshCw, Clock, CheckCircle, TrendingUp } from "lucide-react";
export default function StatsCards({ metrics }) {
  const defaultStats = [
    { label: "Total Processed", key: "total_processed", icon: <Activity size={22} color="black" /> },
    { label: "Success Rate", bar: true, key: "success_rate", icon: <RefreshCw size={22} color="black" /> },
    { label: "Avg Processing Time", key: "avg_processing_time", icon: <Clock size={22} color="black" /> },
    { label: "System Health", key: "system_health", success: true, icon: <CheckCircle size={22} color="black" /> },
  ];

  const dataMap = {};
  if (metrics && metrics.stats) {
    metrics.stats.forEach((item) => {
      dataMap[item.label] = item;
    });
  }

  return (
    <div className="stats-grid">
      {defaultStats.map((stat, index) => {
        const item = dataMap[stat.label];
        const isLoading = !item;

        return (
          <div className="stat-card" key={index}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-icon-top">{stat.icon}</div>
            <div className={`stat-value ${item?.success ? "success" : ""}`}>
              {item?.icon && <span className="stat-icon">{item.icon}</span>}
              {isLoading ? (
                <div className="spinner small" /> // Customize spinner CSS
              ) : (
                item.value
              )}
            </div>

            {stat.key === "success_rate" ? (
              item ? (
                <div className="stat-bar">
                  {parseFloat(item.value) > 0 ? (
                    <div className="stat-bar-fill" style={{ width: item.value }}></div>
                  ) : (
                    <div className="stat-bar-fill empty" />
                  )}
                </div>
              ) : (
                <div className="stat-bar placeholder" />
              )
            ) : null}


            {item?.sub && <div className="stat-sub">
              {/* {(item.sub.includes("1h") || item.sub.includes("24h") || item.sub.includes("7d")) && (
                <TrendingUp className="stat-sub-icon" size={16} color="#10b981" />
              )} */}
              {item.sub}
            </div>}
          </div>
        );
      })}
    </div>
  );
}
