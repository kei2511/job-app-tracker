// components/forms/ApplicationForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { createApplication } from '@/lib/actions/applicationActions';
import { Application } from '@prisma/client';

const applicationSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  company_name: z.string().min(1, 'Company name is required'),
  platform: z.string().optional(),
  job_link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contract_type: z.string().optional(),
  work_model: z.string().optional(),
  location: z.string().optional(),
  salary_expectation: z.string().optional(),
  cv_version: z.string().optional(),
  notes: z.string().optional(),
  date_applied: z.string().optional(),
  status: z.string().optional().default('APPLIED'), // Default status is APPLIED
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onApplicationCreated: () => void;
  trigger?: React.ReactNode;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  onApplicationCreated, 
  trigger = <Button>Add New Application</Button>
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      date_applied: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      status: 'APPLIED', // Default to APPLIED
    },
  });

  // Watch the selected values for controlled select components
  const contractType = watch('contract_type');
  const workModel = watch('work_model');
  const status = watch('status');

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await createApplication(data);
      if (result.success) {
        reset();
        setOpen(false);
        onApplicationCreated(); // Refresh the dashboard
      } else {
        console.error('Failed to create application:', result.error);
      }
    } catch (error) {
      console.error('Error creating application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Job Application</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                {...register('position')}
                placeholder="Frontend Developer"
              />
              {errors.position && (
                <p className="text-red-500 text-sm">{errors.position.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                placeholder="Tech Corp"
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">{errors.company_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                {...register('platform')}
                placeholder="LinkedIn, Indeed, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job_link">Job Link</Label>
              <Input
                id="job_link"
                {...register('job_link')}
                placeholder="https://..."
              />
              {errors.job_link && (
                <p className="text-red-500 text-sm">{errors.job_link.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contract_type">Contract Type</Label>
              <Select 
                value={contractType || ''} 
                onValueChange={(value) => setValue('contract_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="work_model">Work Model</Label>
              <Select 
                value={workModel || ''} 
                onValueChange={(value) => setValue('work_model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WFO">WFO (Work From Office)</SelectItem>
                  <SelectItem value="WFH">WFH (Work From Home)</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="City, Country"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary_expectation">Salary Expectation (Rp)</Label>
              <Input
                id="salary_expectation"
                {...register('salary_expectation')}
                placeholder="Rp 5.000.000 - Rp 8.000.000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status || 'APPLIED'} 
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WISHLIST">Wishlist</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="SCREENING">Screening</SelectItem>
                  <SelectItem value="INTERVIEW_HR">Interview (HR)</SelectItem>
                  <SelectItem value="INTERVIEW_USER">Interview (User)</SelectItem>
                  <SelectItem value="OFFERING">Offering</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="GHOSTED">Ghosted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cv_version">CV Version</Label>
              <Input
                id="cv_version"
                {...register('cv_version')}
                placeholder="CV_Tech_v2.pdf"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="date_applied">Date Applied</Label>
              <Input
                id="date_applied"
                type="date"
                {...register('date_applied')}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Add Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;