'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Application, Tag } from '@prisma/client';
import { Plus, X } from 'lucide-react';

interface ApplicationTagsProps {
  application: Application;
  onUpdate?: (updatedApplication: Application) => void;
}

interface ApplicationWithTag extends Application {
  tags?: Tag[];
}

const ApplicationTags: React.FC<ApplicationTagsProps> = ({ application, onUpdate }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [applicationTags, setApplicationTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTags();
  }, [application.id]);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      
      // Load all user tags
      const tagsResponse = await fetch('/api/tags');
      if (tagsResponse.ok) {
        const tags = await tagsResponse.json();
        setAllTags(tags);
      } else {
        throw new Error('Failed to load tags');
      }
      
      // Load application-specific tags
      const appTagsResponse = await fetch(`/api/application-tags/${application.id}`);
      if (appTagsResponse.ok) {
        const appTags = await appTagsResponse.json();
        setApplicationTags(appTags);
      } else {
        throw new Error('Failed to load application tags');
      }
    } catch (err) {
      setError('Error loading tags');
      console.error('Error loading tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTagToApplication = async (tagId: string) => {
    try {
      const response = await fetch(`/api/application-tags/${application.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId })
      });

      if (response.ok) {
        const newAppTag = await response.json();
        // Reload application tags to reflect the change
        loadTags();
      } else {
        setError('Failed to add tag to application');
      }
    } catch (err) {
      setError('Error adding tag to application');
      console.error('Error adding tag:', err);
    }
  };

  const removeTagFromApplication = async (tagId: string) => {
    try {
      const response = await fetch(`/api/application-tags/${application.id}/${tagId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Reload application tags to reflect the change
        loadTags();
      } else {
        setError('Failed to remove tag from application');
      }
    } catch (err) {
      setError('Error removing tag from application');
      console.error('Error removing tag:', err);
    }
  };

  const createAndAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      // First, create the tag
      const tagResponse = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newTagName.trim(),
          color: '#3b82f6' // Default blue color
        })
      });

      if (!tagResponse.ok) {
        throw new Error('Failed to create tag');
      }

      const newTag = await tagResponse.json();
      
      // Then add it to the application
      await addTagToApplication(newTag.id);
      
      setNewTagName('');
      setShowCreateForm(false);
    } catch (err) {
      setError('Error creating tag');
      console.error('Error creating tag:', err);
    }
  };

  // Tags that are not yet added to this application
  const availableTags = allTags.filter(
    tag => !applicationTags.some(appTag => appTag.id === tag.id)
  );

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium text-gray-500 text-sm mb-2">Categories/Tags</h3>
        
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading tags...</p>
        ) : (
          <>
            {/* Display existing tags */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-8">
              {applicationTags.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No categories added yet</p>
              ) : (
                applicationTags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    style={{ backgroundColor: tag.color ? `${tag.color}20` : '#3b82f620', color: tag.color || '#3b82f6' }} // Add transparency to bg
                    className="flex items-center gap-1"
                  >
                    {tag.name}
                    <button 
                      onClick={() => removeTagFromApplication(tag.id)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            {/* Add existing tag or create new */}
            <div className="flex flex-wrap gap-2">
              {/* Dropdown for existing tags */}
              <div className="relative flex-1 min-w-[150px]">
                <select
                  className="w-full p-2 text-sm border rounded bg-background"
                  onChange={(e) => {
                    if (e.target.value) {
                      addTagToApplication(e.target.value);
                      e.target.value = ''; // Reset the selection
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Add existing tag...
                  </option>
                  {availableTags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Create new tag button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus size={16} className="mr-1" />
                New
              </Button>
            </div>

            {/* Form to create new tag */}
            {showCreateForm && (
              <div className="mt-2 p-3 border rounded bg-muted">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 p-2 text-sm border rounded"
                    onKeyPress={(e) => e.key === 'Enter' && createAndAddTag()}
                  />
                  <Button size="sm" onClick={createAndAddTag}>
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewTagName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationTags;