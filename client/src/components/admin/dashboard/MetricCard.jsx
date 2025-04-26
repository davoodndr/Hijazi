import React from 'react'

export const MetricCard = ({ title, value, trend, icon, className }) => {
  return (
    <div className="bg-dashboard-card p-6 rounded-xl shadow-sm border border-gray-100
      hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dashboard-muted text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 text-dashboard-text">{value}</h3>
        </div>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
        <span className="text-dashboard-muted text-sm ml-1">vs last month</span>
      </div>
    </div>
  );
};

export default MetricCard