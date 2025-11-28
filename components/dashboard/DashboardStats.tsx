// components/dashboard/DashboardStats.tsx
import React from 'react';

interface DashboardStatsProps {
  totalApplications: number;
  responseRate: number;
  activeProcesses: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalApplications, 
  responseRate, 
  activeProcesses 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <div className="bg-card p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Apps</h3>
        <p className="text-xl sm:text-2xl font-bold mt-1">{totalApplications}</p>
      </div>
      <div className="bg-card p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
        <p className="text-xl sm:text-2xl font-bold mt-1 text-green-600">{responseRate}%</p>
      </div>
      <div className="bg-card p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Active</h3>
        <p className="text-xl sm:text-2xl font-bold mt-1">{activeProcesses}</p>
      </div>
    </div>
  );
};

export default DashboardStats;