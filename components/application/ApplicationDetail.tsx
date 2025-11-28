// components/application/ApplicationDetail.tsx
'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/dateUtils';
import { Application } from '@prisma/client';
import { updateApplication } from '@/lib/actions/applicationActions';
import { useRouter } from 'next/navigation';

interface ApplicationDetailProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedApplication: Application) => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  open,
  onOpenChange,
  onUpdate
}) => {
  const router = useRouter();
  
  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WISHLIST': return 'bg-gray-500';
      case 'APPLIED': return 'bg-blue-500';
      case 'SCREENING': return 'bg-yellow-500';
      case 'INTERVIEW_HR': case 'INTERVIEW_USER': return 'bg-purple-500';
      case 'OFFERING': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'GHOSTED': return 'bg-gray-700';
      default: return 'bg-gray-500';
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (application && application.id) {
      // Optimistically update the local application data
      const updatedApplication = {
        ...application,
        status: newStatus as any, // Type assertion to match the enum type
        last_updated: new Date()
      };

      // Close the dialog first
      onOpenChange(false);

      // Call the parent's update function if provided
      if (onUpdate) {
        onUpdate(updatedApplication);
      }

      try {
        // Update the application in the database
        const result = await updateApplication(application.id, { ...application, status: newStatus });

        if (!result.success) {
          console.error('Failed to update application status:', result.error);
          // In a real app, you might want to notify the user or revert the optimistic update
        }
      } catch (error) {
        console.error('Error updating application status:', error);
        // In a real app, you might want to notify the user or revert the optimistic update
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">{application.position}</DialogTitle>
              <p className="text-lg text-gray-600">{application.company_name}</p>
            </div>
            <Badge className={`${getStatusColor(application.status)} text-white`}>
              {application.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <h3 className="font-medium text-gray-500 text-sm">Platform</h3>
              <p className="text-sm">{application.platform || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 text-sm">Date Applied</h3>
              <p className="text-sm">{application.date_applied ? formatDate(application.date_applied) : '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 text-sm">Contract Type</h3>
              <p className="text-sm">{application.contract_type || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 text-sm">Work Model</h3>
              <p className="text-sm">{application.work_model || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 text-sm">Location</h3>
              <p className="text-sm">{application.location || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 text-sm">Salary Expectation</h3>
              <p className="text-sm">{application.salary_expectation ? `Rp ${application.salary_expectation}` : '-'}</p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="font-medium text-gray-500 text-sm">Job Link</h3>
              {application.job_link ? (
                <a
                  href={application.job_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm break-all"
                >
                  {application.job_link}
                </a>
              ) : (
                <p className="text-sm">-</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-500 text-sm">CV Version</h3>
            <p className="text-sm">{application.cv_version || '-'}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-500 text-sm">Notes</h3>
            <p className="whitespace-pre-line text-sm">{application.notes || '-'}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium text-gray-500 mb-2 text-sm">Update Status</h3>
            <div className="flex flex-wrap gap-1.5">
              {['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW_HR', 'INTERVIEW_USER', 'OFFERING', 'REJECTED', 'GHOSTED'].map((status) => (
                <Button
                  key={status}
                  variant={application.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(status)}
                  className={getStatusColor(status) + " text-xs py-1.5 px-2"}
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetail;