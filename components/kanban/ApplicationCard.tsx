// components/kanban/ApplicationCard.tsx
'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Application } from '@prisma/client';
import { getDaysSinceApplied } from '@/lib/utils';
import ApplicationDetail from '@/components/application/ApplicationDetail';

interface ApplicationCardProps {
  application: Application;
  index: number;
  isGhosted: boolean;
  onUpdate?: (updatedApplication: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index, isGhosted, onUpdate }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const daysSinceApplied = getDaysSinceApplied(application.date_applied);
  
  return (
    <>
      <Draggable draggableId={application.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              bg-white p-4 rounded-lg shadow-md border-l-4 cursor-pointer
              ${application.status === 'WISHLIST' ? 'border-gray-400' : 
                application.status === 'APPLIED' ? 'border-blue-500' : 
                application.status === 'SCREENING' ? 'border-yellow-500' : 
                application.status === 'INTERVIEW_HR' || application.status === 'INTERVIEW_USER' ? 'border-purple-500' : 
                application.status === 'OFFERING' ? 'border-green-500' : 
                application.status === 'REJECTED' ? 'border-red-500' : 
                'border-gray-500'}
              ${isGhosted ? 'border-red-500 bg-red-50' : ''}
              transition-all duration-200 hover:shadow-lg
            `}
            onClick={() => setDetailOpen(true)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  {application.is_bookmarked && (
                    <span className="text-yellow-500">★</span>
                  )}
                  <h3 className="font-bold text-base truncate">{application.position}</h3>
                </div>
                <p className="text-gray-600 truncate text-sm">{application.company_name}</p>
                <div className="flex items-center gap-1 mt-1">
                  {application.priority === 'HIGH' && (
                    <span className="w-2 h-2 rounded-full bg-red-500" title="High Priority"></span>
                  )}
                  {application.priority === 'MEDIUM' && (
                    <span className="w-2 h-2 rounded-full bg-yellow-500" title="Medium Priority"></span>
                  )}
                  {application.priority === 'LOW' && (
                    <span className="w-2 h-2 rounded-full bg-green-500" title="Low Priority"></span>
                  )}
                </div>
              </div>
              {isGhosted && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                  ⚠️ Check
                </span>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Applied: {new Date(application.date_applied).toLocaleDateString()}</p>
              {daysSinceApplied >= 14 && application.status === 'APPLIED' && !application.is_reminder_sent && (
                <p className="text-red-500 font-medium">⚠️ {daysSinceApplied} days - No response</p>
              )}
            </div>
            {application.notes && (
              <p className="mt-1 text-xs text-gray-700 line-clamp-2">{application.notes}</p>
            )}
          </div>
        )}
      </Draggable>
      <ApplicationDetail
        application={application}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ApplicationCard;