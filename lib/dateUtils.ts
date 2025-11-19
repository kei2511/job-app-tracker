// lib/dateUtils.ts

// Utility function to format date
export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}