// app/dashboard/DashboardClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import ApplicationForm from '@/components/forms/ApplicationForm';
import UserMenu from '@/components/auth/UserMenu';
import MobileNav from '@/components/nav/MobileNav';
import ApplicationTable from '@/components/application/ApplicationTable';
import { Button } from '@/components/ui/button';
import { Application } from '@prisma/client';
import { LayoutList, Kanban } from 'lucide-react';

interface DashboardClientProps {
  initialApplications: Application[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ initialApplications }) => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban'); // Default to kanban view

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

  // Listen for openApplicationForm event from MobileNav
  React.useEffect(() => {
    const handleOpenForm = () => {
      setShowForm(true);
    };

    window.addEventListener('openApplicationForm', handleOpenForm);
    return () => {
      window.removeEventListener('openApplicationForm', handleOpenForm);
    };
  }, []);

  const handleApplicationUpdate = (updatedApplication: Application) => {
    setApplications(prev =>
      prev.map(app => app.id === updatedApplication.id ? updatedApplication : app)
    );
  };

  return (
    <div>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-10 bg-background border-b px-2 py-3 -mb-4">
        <div className="flex justify-between items-center">
          <MobileNav />
          <h1 className="text-lg font-semibold">Job Tracker</h1>
          <div className="w-10"></div> {/* Spacer for mobile menu button */}
        </div>
      </header>

      <div className="container mx-auto py-4 sm:py-6 px-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold hidden md:block">Job Application Tracker</h1>
            <h1 className="text-xl font-bold md:hidden">Applications</h1>
            <p className="text-sm text-gray-500">{applications.length} applications</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                className="px-3 py-1.5 text-xs"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                className="px-3 py-1.5 text-xs"
                onClick={() => setViewMode('table')}
              >
                <LayoutList className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
            <ApplicationForm onApplicationCreated={refreshApplications} open={showForm} onOpenChange={setShowForm} />
            <UserMenu />
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <KanbanBoard
            initialApplications={applications}
            onUpdate={handleApplicationUpdate}
            compactView={applications.length > 20} // Use compact view when more than 20 applications
          />
        ) : (
          <ApplicationTable
            applications={applications}
            onUpdate={handleApplicationUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardClient;