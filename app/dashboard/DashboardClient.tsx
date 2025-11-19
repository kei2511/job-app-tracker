// app/dashboard/DashboardClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import ApplicationForm from '@/components/forms/ApplicationForm';
import UserMenu from '@/components/auth/UserMenu';
import { Application } from '@prisma/client';

interface DashboardClientProps {
  initialApplications: Application[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ initialApplications }) => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  
  const refreshApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Application Tracker</h1>
        <div className="flex items-center space-x-4">
          <ApplicationForm onApplicationCreated={refreshApplications} />
          <UserMenu />
        </div>
      </div>
      <KanbanBoard initialApplications={applications} />
    </div>
  );
};

export default DashboardClient;