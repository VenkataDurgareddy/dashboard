import React from "react";
import "../styles/stats_card.css";

export default function StatsCards({ metrics }) {
  if (!metrics || !metrics.stats) {
    return null; // or show loading spinner
  }

  return (
    <div className="stats-grid">
      {metrics.stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-label">{stat.label}</div>

          <div className={`stat-value ${stat.success ? "success" : ""}`}>
            {stat.icon && <span className="stat-icon">{stat.icon}</span>}
            {stat.value}
          </div>

          {stat.bar && <div className="stat-bar"></div>}

          {stat.sub && <div className="stat-sub">{stat.sub}</div>}
        </div>
      ))}
    </div>
  );
}
