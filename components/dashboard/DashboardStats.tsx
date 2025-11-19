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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-500">Total Applications</h3>
        <p className="text-3xl font-bold mt-2">{totalApplications}</p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-500">Response Rate</h3>
        <p className="text-3xl font-bold mt-2 text-green-600">{responseRate}%</p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-500">Active Processes</h3>
        <p className="text-3xl font-bold mt-2">{activeProcesses}</p>
      </div>
    </div>
  );
};

export default DashboardStats;