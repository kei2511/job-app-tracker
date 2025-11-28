'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/dateUtils';
import { Application } from '@prisma/client';
import { Bell, Check, X } from 'lucide-react';

interface ReminderNotificationProps {
  applications: Application[];
}

const ReminderNotification: React.FC<ReminderNotificationProps> = ({ applications }) => {
  const [reminders, setReminders] = useState<Application[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Filter applications with upcoming reminders (today and in the future)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const upcomingReminders = applications.filter(app => 
      app.reminder_date && 
      new Date(app.reminder_date) >= today && 
      !app.is_reminder_sent
    );
    
    setReminders(upcomingReminders);
    setShowNotification(upcomingReminders.length > 0);
  }, [applications]);

  const handleDismiss = (applicationId: string) => {
    // Remove the reminder from the list
    setReminders(prev => prev.filter(rem => rem.id !== applicationId));
    
    // If no reminders left, hide the notification
    if (reminders.length <= 1) {
      setShowNotification(false);
    }
  };

  if (!showNotification || reminders.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <h4 className="font-bold text-blue-800">Upcoming Reminders</h4>
            </div>
            <p className="text-sm mt-1 text-blue-600">
              You have {reminders.length} pending reminder{reminders.length > 1 ? 's' : ''}
            </p>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {reminders.map(application => (
                <div key={application.id} className="text-xs p-2 bg-white rounded border border-blue-100">
                  <div className="font-medium truncate">{application.position}</div>
                  <div className="truncate text-gray-600">{application.company_name}</div>
                  <div className="mt-1">
                    <span className="text-gray-500">Date: </span>
                    <span className="font-medium">{formatDate(application.reminder_date || new Date())}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-blue-500 hover:text-blue-700 ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-end mt-3 space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setShowNotification(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderNotification;