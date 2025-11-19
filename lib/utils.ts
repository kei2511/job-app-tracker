import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to calculate response rate
export function calculateResponseRate(applications: any[]) {
  if (applications.length === 0) return 0;
  
  const appliedCount = applications.filter(app => app.status !== 'WISHLIST').length;
  const respondedCount = applications.filter(app => 
    app.status === 'SCREENING' || 
    app.status === 'INTERVIEW_HR' || 
    app.status === 'INTERVIEW_USER' || 
    app.status === 'OFFERING' || 
    app.status === 'REJECTED'
  ).length;
  
  return appliedCount > 0 ? Math.round((respondedCount / appliedCount) * 100) : 0;
}

// Utility function to get days since applied
export function getDaysSinceApplied(dateApplied: Date) {
  const today = new Date();
  const appliedDate = new Date(dateApplied);
  const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Utility function to check if an application is ghosted
export function isGhosted(application: any) {
  return (
    application.status === 'APPLIED' && 
    getDaysSinceApplied(application.date_applied) >= 14 && 
    !application.is_reminder_sent
  );
}