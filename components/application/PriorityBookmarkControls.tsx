'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Application } from '@prisma/client';

interface PriorityBookmarkControlsProps {
  application: Application;
  onUpdate: (updatedApplication: Application) => void;
}

const PriorityBookmarkControls: React.FC<PriorityBookmarkControlsProps> = ({ 
  application, 
  onUpdate 
}) => {
  const toggleBookmark = async () => {
    try {
      const response = await fetch('/api/application-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          isBookmarked: !application.is_bookmarked
        })
      });
      
      if (response.ok) {
        const updatedApp = await response.json();
        onUpdate(updatedApp);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const updatePriority = async (newPriority: string) => {
    try {
      const response = await fetch('/api/application-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          priority: newPriority
        })
      });
      
      if (response.ok) {
        const updatedApp = await response.json();
        onUpdate(updatedApp);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-2">
        <h3 className="font-medium text-gray-500 text-sm">Priority</h3>
        <Select 
          value={application.priority} 
          onValueChange={updatePriority}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Low
              </div>
            </SelectItem>
            <SelectItem value="MEDIUM">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                Medium
              </div>
            </SelectItem>
            <SelectItem value="HIGH">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                High
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-500 text-sm">Bookmark</h3>
        <Button
          variant={application.is_bookmarked ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={toggleBookmark}
        >
          {application.is_bookmarked ? (
            <>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Bookmarked
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Bookmark
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PriorityBookmarkControls;