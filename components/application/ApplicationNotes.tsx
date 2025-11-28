'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Application, ApplicationNote } from '@prisma/client';
import { formatDate } from '@/lib/dateUtils';

interface ApplicationNotesProps {
  application: Application;
  onUpdate?: (updatedApplication: Application) => void;
}

const ApplicationNotes: React.FC<ApplicationNotesProps> = ({ application, onUpdate }) => {
  const [notes, setNotes] = useState<ApplicationNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [application.id]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/application-notes/${application.id}`);
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      } else {
        setError('Failed to load notes');
      }
    } catch (err) {
      setError('Error loading notes');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/application-notes/${application.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote.trim() })
      });

      if (response.ok) {
        const note = await response.json();
        setNotes([note, ...notes]); // Add new note to the top
        setNewNote('');
      } else {
        setError('Failed to add note');
      }
    } catch (err) {
      setError('Error adding note');
      console.error('Error adding note:', err);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/application-notes/${application.id}/${noteId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        setError('Failed to delete note');
      }
    } catch (err) {
      setError('Error deleting note');
      console.error('Error deleting note:', err);
    }
  };

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-500 text-sm mb-2">Additional Notes</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No additional notes yet. Add your first note below.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start">
                  <p className="text-sm whitespace-pre-line">{note.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                    onClick={() => deleteNote(note.id)}
                  >
                    ×
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(note.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a note about this application..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            className="text-sm"
          />
          <Button 
            onClick={addNote} 
            size="sm"
            disabled={!newNote.trim()}
            className="self-start"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationNotes;