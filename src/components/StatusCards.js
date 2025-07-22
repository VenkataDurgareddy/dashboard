import React from "react";
import "../styles/activecard.css";
import { Users, Database, Activity } from "lucide-react";

export default function StatusCards({ metrics, queue_summary, cache_performance }) {
  // Default values when data is missing
  const activeUsersData = metrics || {
    active_users: '--',
    peak_today: '--',
    average: '--'
  };

  const cacheData = cache_performance || {
    hit_rate: '--',
    miss_rate: '--',
    percentage: '--'
  };

  const queueData = queue_summary || {
    pending: '--',
    processing: '--',
    completed: '--'
  };

  return (
    <div className="status-cards-container">
      {/* Active Users - Always shown */}
      <div className="cardac">
        <div className="card-title">
          <span className="icon"><Users size={22} strokeWidth={2.2} /></span>
          <span className="activespan">Active Users</span>
        </div>
        <div className="card-value">{activeUsersData.active_users}</div>
        <div className="card-subtext">
          <div>
            Peak Today <span className="card-subdata1">{activeUsersData.peak_today || '--'}</span>
          </div>
          <div>
            Average <span className="card-subdata2">{activeUsersData.average || '--'}</span>
          </div>
        </div>
      </div>

      {/* Cache Performance - Always shown */}
      <div className="cardac">
        <div className="card-title">
          <span className="icon"><Database size={22} strokeWidth={2.2} /></span>
          <span className="activespan">Cache Performance</span>
        </div>
        <div className="card-value">{cacheData.percentage || '--'}</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: cacheData.percentage ? `${cacheData.percentage}px` : '0px' }}
          ></div>
        </div>
        <div className="card-subtext row-split">
          <div className="hit">
            Hit Rate <span className="card-subdata success">{cacheData.hit_rate || '--'}</span>
          </div>
          <div className="miss">
            Miss Rate <span className="card-subdata danger">{cacheData.miss_rate || '--'}</span>
          </div>
        </div>
      </div>

      {/* Queue Status - Always shown */}
      <div className="cardac">
        <div className="card-title">
          <span className="icon"><Activity size={22} strokeWidth={2.2} /></span>
          <span className="activespan">Queue Status</span>
        </div>
        <div className="card-value">{queueData.pending}</div>
        <div className="card-subtext">
          <span className="card-subdata">jobs pending</span>
        </div>
        <div className="card-subtext row-split">
          <div>
            Processing <span className="card-subdata">{queueData.processing || '--'}</span>
          </div>
          <div>
            Completed Today <span className="card-subdata">{queueData.completed || '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}