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
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ 
  application, 
  open, 
  onOpenChange 
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
      await updateApplication(application.id, { ...application, status: newStatus });
      onOpenChange(false); // Close the dialog after updating
      router.refresh(); // Refresh the page to show updates
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500">Platform</h3>
              <p>{application.platform || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Date Applied</h3>
              <p>{application.date_applied ? formatDate(application.date_applied) : '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Contract Type</h3>
              <p>{application.contract_type || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Work Model</h3>
              <p>{application.work_model || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Location</h3>
              <p>{application.location || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Salary Expectation</h3>
              <p>{application.salary_expectation ? `Rp ${application.salary_expectation}` : '-'}</p>
            </div>
            <div className="col-span-2">
              <h3 className="font-medium text-gray-500">Job Link</h3>
              {application.job_link ? (
                <a 
                  href={application.job_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {application.job_link}
                </a>
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-500">CV Version</h3>
            <p>{application.cv_version || '-'}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-500">Notes</h3>
            <p className="whitespace-pre-line">{application.notes || '-'}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium text-gray-500 mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW_HR', 'INTERVIEW_USER', 'OFFERING', 'REJECTED', 'GHOSTED'].map((status) => (
                <Button
                  key={status}
                  variant={application.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(status)}
                  className={getStatusColor(status)}
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