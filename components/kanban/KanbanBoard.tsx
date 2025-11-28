// components/kanban/KanbanBoard.tsx
'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { updateApplicationStatus } from '@/lib/actions/applicationActions';
import { calculateResponseRate, getDaysSinceApplied, isGhosted } from '@/lib/utils';
import { Application } from '@prisma/client';
import ApplicationCard from './ApplicationCard';
import CompactApplicationCard from './CompactApplicationCard';
import DashboardStats from '../dashboard/DashboardStats';
import GhostingReminder from '../application/GhostingReminder';

interface KanbanBoardProps {
  initialApplications: Application[];
  onUpdate?: (updatedApplication: Application) => void;
  compactView?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialApplications, onUpdate, compactView = false }) => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  
  const statusColumns: { id: string; title: string; color: string }[] = [
    { id: 'WISHLIST', title: 'Wishlist', color: 'bg-gray-200' },
    { id: 'APPLIED', title: 'Applied', color: 'bg-blue-200' },
    { id: 'SCREENING', title: 'Screening', color: 'bg-yellow-200' },
    { id: 'INTERVIEW_HR', title: 'Interview (HR)', color: 'bg-purple-200' },
    { id: 'INTERVIEW_USER', title: 'Interview (User)', color: 'bg-purple-300' },
    { id: 'OFFERING', title: 'Offering', color: 'bg-green-200' },
    { id: 'REJECTED', title: 'Rejected', color: 'bg-red-200' },
    { id: 'GHOSTED', title: 'Ghosted', color: 'bg-gray-400' },
  ];

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const movedApplication = applications.find(app => app.id === draggableId);
    if (!movedApplication) return;

    // Optimistically update the UI
    const updatedAppsOptimistic = applications.map(app =>
      app.id === draggableId ? { ...app, status: destination.droppableId as any, last_updated: new Date() } : app
    );

    // Re-sort the list after the status change
    const sortedApps = [...updatedAppsOptimistic].sort((a, b) => {
      // First, sort by bookmark status (bookmarked first)
      if (a.is_bookmarked && !b.is_bookmarked) return -1;
      if (!a.is_bookmarked && b.is_bookmarked) return 1;

      // If both are bookmarked or both not bookmarked, sort by priority
      const priorityOrder: Record<string, number> = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const priorityA = priorityOrder[a.priority as string] || 2; // Default to MEDIUM if not set
      const priorityB = priorityOrder[b.priority as string] || 2; // Default to MEDIUM if not set

      // If priorities are different, sort by priority
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }

      // If priorities are the same, sort by date applied (newest first)
      return new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime();
    });

    setApplications(sortedApps);

    // Update the status in the database
    try {
      const statusChange = await updateApplicationStatus(draggableId, destination.droppableId);

      if (!statusChange.success) {
        // If server update fails, revert the optimistic update
        const revertedApps = applications.map(app =>
          app.id === draggableId ? movedApplication : app
        );
        setApplications(revertedApps);
        console.error('Failed to update application status:', statusChange.error);
      } else {
        // Call onUpdate if provided to notify parent about the change
        if (onUpdate) {
          const updatedApplication = { ...movedApplication, status: destination.droppableId as any, last_updated: new Date() };
          onUpdate(updatedApplication);
        }
      }
    } catch (error) {
      // If server update fails, revert the optimistic update
      const revertedApps = applications.map(app =>
        app.id === draggableId ? movedApplication : app
      );
      setApplications(revertedApps);
      console.error('Error updating application status:', error);
    }
  };

  const groupedApplications = statusColumns.map(column => ({
    ...column,
    applications: applications.filter(app => app.status === column.id),
  }));

  const responseRate = calculateResponseRate(applications);

  return (
    <div>
      <GhostingReminder applications={applications} />
      <DashboardStats 
        totalApplications={applications.length} 
        responseRate={responseRate} 
        activeProcesses={applications.filter(app => 
          app.status !== 'REJECTED' && app.status !== 'GHOSTED'
        ).length}
      />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
          {groupedApplications.map((column) => (
            <div key={column.id} className="bg-gray-100 p-3 rounded-lg min-w-[280px]">
              <h2 className={`font-bold text-center py-2 rounded-t ${column.color} text-sm sm:text-base`}>
                {column.title} ({column.applications.length})
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[150px] p-2"
                  >
                    {column.applications.map((application, index) => (
                      <div key={application.id} className={compactView ? "mb-1" : "mb-2"}>
                        {compactView ? (
                          <CompactApplicationCard
                            application={application}
                            index={index}
                            isGhosted={isGhosted(application)}
                          />
                        ) : (
                          <ApplicationCard
                            application={application}
                            index={index}
                            isGhosted={isGhosted(application)}
                            onUpdate={(updatedApp) => {
                              setApplications(prev =>
                                prev.map(app => app.id === updatedApp.id ? updatedApp : app)
                              );
                            }}
                          />
                        )}
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;