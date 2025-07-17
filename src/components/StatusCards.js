import React from "react";
import "../styles/activecard.css";
import userIcon from "../icons/user_icon.png";
import cacheIcon from "../icons/cache_icon.png";
import queueIcon from "../icons/queue_icon.png";

export default function StatusCards({ metrics, queue_summary, cache_performance }) {
  if (!metrics || !queue_summary || !cache_performance) return <div>Loading...</div>;

  return (
    <div className="status-cards-container">
      {/* Active Users */}
      <div className="cardac">
        <div className="card-title">
          <span className="icon">
            <img src={userIcon} alt="User Icon" style={{ width: "25px", height: "25px" }} />
          </span>
          <span className="activespan">Active Users</span>
        </div>
        <div className="card-value">{metrics.active_users}</div>
        <div className="card-subtext">
          <div>
            Peak Today <span className="card-subdata1">1,847</span>
          </div>
          <div>
            Average <span className="card-subdata2">1,234</span>
          </div>
        </div>
      </div>

      {/* Cache Performance */}
      <div className="cardac">
        <div className="card-title">
          <span className="icon">
            <img src={cacheIcon} alt="Cache Icon" style={{ width: "30px", height: "30px" }} />
          </span>
          <span className="activespan">Cache Performance</span>
        </div>
        <div className="card-value">{cache_performance.score}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${cache_performance.score}%` }}></div>
        </div>
        <div className="card-subtext row-split">
          <div className="hit">
            Hit Rate <span className="card-subdata success">{cache_performance.hit_rate}</span>
          </div>
          <div className="miss">
            Miss Rate <span className="card-subdata danger">{cache_performance.miss_rate}</span>
          </div>
        </div>
      </div>

      {/* Queue Status */}
      <div className="cardac">
        <div className="card-title">
          <span className="icon">
            <img src={queueIcon} alt="Queue Icon" style={{ width: "25px", height: "25px" }} />
          </span>
          <span className="activespan">Queue Status</span>
        </div>
        <div className="card-value">{queue_summary.pending}</div>
        <div className="card-subtext">
          <span className="card-subdata">jobs pending</span>
        </div>
        <div className="card-subtext row-split">
          <div>
            Processing <span className="card-subdata">{queue_summary.processing}</span>
          </div>
          <div>
            Completed Today <span className="card-subdata">{queue_summary.completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
