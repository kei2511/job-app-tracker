// components/application/GhostingReminder.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { markReminderSent } from '@/lib/actions/applicationActions';
import { Application } from '@prisma/client';
import { isGhosted, getDaysSinceApplied } from '@/lib/utils';

interface GhostingReminderProps {
  applications: Application[];
}

const GhostingReminder: React.FC<GhostingReminderProps> = ({ applications }) => {
  const [remindedApplications, setRemindedApplications] = useState<Set<string>>(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationApp, setNotificationApp] = useState<Application | null>(null);

  useEffect(() => {
    const checkForGhostedApplications = () => {
      // Only show notification for applications that haven't been reminded yet
      const unremindedGhostedApps = applications.filter(application =>
        isGhosted(application) && !remindedApplications.has(application.id)
      );

      if (unremindedGhostedApps.length > 0) {
        // Show notification for the first unreminded ghosted application
        setNotificationApp(unremindedGhostedApps[0]);
        setShowNotification(true);

        // Add to reminded set to prevent duplicate notifications
        setRemindedApplications(prev => new Set(prev).add(unremindedGhostedApps[0].id));
      }
    };

    checkForGhostedApplications();
  }, [applications, remindedApplications]);

  const handleMarkAsGhosted = async () => {
    if (!notificationApp) return;
    
    // Update application status to GHOSTED
    const result = await markReminderSent(notificationApp.id);
    if (result.success) {
      try {
        const response = await fetch(`/api/applications/${notificationApp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'GHOSTED' }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update application status');
        }
        
        // Close the notification after successful update
        setShowNotification(false);
      } catch (error) {
        console.error('Error updating application status:', error);
      }
    }
  };

  const handleDismiss = async () => {
    if (notificationApp) {
      // Mark reminder as sent without changing status
      const result = await markReminderSent(notificationApp.id);
      if (!result.success) {
        console.error('Failed to mark reminder as sent');
      }
    }
    
    setShowNotification(false);
  };

  if (!showNotification || !notificationApp) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2.5 rounded-lg shadow-lg max-w-[calc(100vw-32px)]">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Reminder: Follow up!</p>
          <p className="text-xs mt-1">
            You haven't heard back from <strong>{notificationApp.company_name}</strong> in 2 weeks. Follow up or mark as Ghosted.
          </p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="text-yellow-700 hover:text-yellow-900 ml-2 flex-shrink-0 text-sm"
        >
          ✕
        </button>
      </div>
      <div className="flex mt-2 space-x-1.5">
        <button
          onClick={handleMarkAsGhosted}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1.5 rounded flex-1 min-w-[80px]"
        >
          Mark as Ghosted
        </button>
        <button
          onClick={handleDismiss}
          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2.5 py-1.5 rounded flex-1 min-w-[60px]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default GhostingReminder;