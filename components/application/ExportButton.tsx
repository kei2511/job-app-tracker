'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';

const ExportButton = () => {
  const handleExport = async () => {
    try {
      // Show a temporary message to the user
      const originalText = document.activeElement?.textContent || 'Export';
      
      // Initiate download
      window.location.href = '/api/export';
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <DownloadIcon className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
};

export default ExportButton;