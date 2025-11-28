'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Application } from '@prisma/client';
import { calculateApplicationStats } from '@/lib/statistics';

interface ApplicationStatisticsProps {
  applications: Application[];
}

// Define types for our statistics
interface StatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // Allow additional properties as expected by Recharts
}

interface MonthlyData {
  month: string;
  applications: number;
}

const ApplicationStatistics: React.FC<ApplicationStatisticsProps> = ({ applications }) => {
  const stats = calculateApplicationStats(applications);

  // Prepare data for status distribution pie chart
  const statusData: StatusData[] = Object.entries(stats.statusDistribution).map(([status, value]) => {
    // Define colors for different statuses
    const colorMap: Record<string, string> = {
      'WISHLIST': '#9ca3af',
      'APPLIED': '#3b82f6',
      'SCREENING': '#f59e0b',
      'INTERVIEW_HR': '#8b5cf6',
      'INTERVIEW_USER': '#a78bfa',
      'OFFERING': '#10b981',
      'REJECTED': '#ef4444',
      'GHOSTED': '#6b7280'
    };

    return {
      name: status.replace('_', ' '),
      value,
      color: colorMap[status] || '#6b7280'
    };
  });

  // Prepare data for monthly applications bar chart
  const monthlyData: MonthlyData[] = Object.entries(stats.monthlyApplications)
    .map(([month, applications]) => ({
      month: month, // Will be formatted as YYYY-MM
      applications
    }))
    .sort((a, b) => a.month.localeCompare(b.month)); // Sort chronologically

  // Status distribution colors
  const statusColors = statusData.map(item => item.color);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Stats Summary Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">Applications with responses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">Job offers received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDaysToResponse} days</div>
            <p className="text-xs text-muted-foreground">To first response</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Application Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Applications Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Applications by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" name="Applications" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Companies Applied To</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.topCompanies.map((company, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold">{company.count}</div>
                <div className="text-sm text-gray-600 truncate">{company.company}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStatistics;