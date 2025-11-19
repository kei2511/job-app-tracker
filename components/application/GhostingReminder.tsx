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
      applications.forEach(application => {
        if (isGhosted(application) && !remindedApplications.has(application.id)) {
          // Set the notification data and show it
          setNotificationApp(application);
          setShowNotification(true);
          
          // Add to reminded set to prevent duplicate notifications
          setRemindedApplications(prev => new Set(prev).add(application.id));
        }
      });
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
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg max-w-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">Reminder: Follow up!</p>
          <p className="text-sm mt-1">
            You haven't heard back from <strong>{notificationApp.company_name}</strong> in 2 weeks. Follow up or mark as Ghosted.
          </p>
        </div>
        <button 
          onClick={() => setShowNotification(false)}
          className="text-yellow-700 hover:text-yellow-900 ml-2"
        >
          ✕
        </button>
      </div>
      <div className="flex mt-2 space-x-2">
        <button
          onClick={handleMarkAsGhosted}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
        >
          Mark as Ghosted
        </button>
        <button
          onClick={handleDismiss}
          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default GhostingReminder;