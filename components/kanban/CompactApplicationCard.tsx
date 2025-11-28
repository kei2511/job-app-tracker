// components/kanban/CompactApplicationCard.tsx
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

const CompactApplicationCard: React.FC<ApplicationCardProps> = ({ application, index, isGhosted, onUpdate }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const daysSinceApplied = getDaysSinceApplied(application.date_applied);

  // Limit text length for compact view
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <Draggable draggableId={application.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              bg-white p-2 rounded border-l-4 cursor-pointer text-xs
              ${application.status === 'WISHLIST' ? 'border-gray-400' :
                application.status === 'APPLIED' ? 'border-blue-500' :
                application.status === 'SCREENING' ? 'border-yellow-500' :
                application.status === 'INTERVIEW_HR' || application.status === 'INTERVIEW_USER' ? 'border-purple-500' :
                application.status === 'OFFERING' ? 'border-green-500' :
                application.status === 'REJECTED' ? 'border-red-500' :
                'border-gray-500'}
              ${isGhosted ? 'border-red-500 bg-red-50' : ''}
              transition-all duration-200 hover:shadow-sm hover:scale-[1.02]
            `}
            onClick={() => setDetailOpen(true)}
          >
            <div className="font-medium truncate">{truncateText(application.position, 30)}</div>
            <div className="text-gray-600 truncate">{truncateText(application.company_name, 25)}</div>
            <div className="text-gray-500 mt-1">
              {application.date_applied ? new Date(application.date_applied).toLocaleDateString() : ''}
            </div>
            {daysSinceApplied >= 14 && application.status === 'APPLIED' && !application.is_reminder_sent && (
              <div className="text-red-500 font-medium text-xs mt-1">⚠️ {daysSinceApplied} days</div>
            )}
            {isGhosted && (
              <div className="text-red-500 text-xs">⚠️ Check Status</div>
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

export default CompactApplicationCard;