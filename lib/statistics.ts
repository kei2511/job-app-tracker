// lib/statistics.ts

import { Application } from '@prisma/client';

interface ApplicationStats {
  totalApplications: number;
  statusDistribution: Record<string, number>;
  responseRate: number;
  avgDaysToResponse: number;
  successRate: number;
  monthlyApplications: Record<string, number>;
  topCompanies: { company: string; count: number }[];
}

export const calculateApplicationStats = (applications: Application[]): ApplicationStats => {
  const totalApplications = applications.length;
  
  // Calculate status distribution
  const statusDistribution: Record<string, number> = {};
  applications.forEach(app => {
    statusDistribution[app.status] = (statusDistribution[app.status] || 0) + 1;
  });
  
  // Calculate response rate (offerings and rejections count as responses)
  const respondedApplications = applications.filter(app => 
    app.status === 'OFFERING' || app.status === 'REJECTED' || app.status === 'GHOSTED'
  );
  const responseRate = totalApplications > 0 
    ? Math.round((respondedApplications.length / totalApplications) * 100) 
    : 0;

  // Calculate success rate (offerings)
  const successfulApplications = applications.filter(app => app.status === 'OFFERING');
  const successRate = totalApplications > 0 
    ? Math.round((successfulApplications.length / totalApplications) * 100) 
    : 0;

  // Calculate average days to response
  let totalDays = 0;
  let daysCount = 0;
  respondedApplications.forEach(app => {
    if (app.last_updated && app.date_applied) {
      const days = Math.floor((app.last_updated.getTime() - app.date_applied.getTime()) / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        totalDays += days;
        daysCount++;
      }
    }
  });
  const avgDaysToResponse = daysCount > 0 ? Math.round(totalDays / daysCount) : 0;

  // Calculate monthly applications (group by month-year)
  const monthlyApplications: Record<string, number> = {};
  applications.forEach(app => {
    const monthYear = `${app.date_applied.getFullYear()}-${(app.date_applied.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyApplications[monthYear] = (monthlyApplications[monthYear] || 0) + 1;
  });

  // Calculate top companies
  const companyCount: Record<string, number> = {};
  applications.forEach(app => {
    companyCount[app.company_name] = (companyCount[app.company_name] || 0) + 1;
  });
  
  const topCompanies = Object.entries(companyCount)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  return {
    totalApplications,
    statusDistribution,
    responseRate,
    avgDaysToResponse,
    successRate,
    monthlyApplications,
    topCompanies
  };
};