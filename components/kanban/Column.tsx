// components/kanban/Column.tsx
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Application } from '@prisma/client';
import ApplicationCard from './ApplicationCard';
import { isGhosted } from '@/lib/utils';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
  };
  applications: Application[];
}

const Column: React.FC<ColumnProps> = ({ column, applications }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-72">
      <h2 className={`font-bold text-center py-2 rounded-t ${column.color}`}>
        {column.title} ({applications.length})
      </h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px] p-2"
          >
            {applications.map((application, index) => (
              <Draggable key={application.id} draggableId={application.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ApplicationCard 
                      application={application} 
                      index={index} 
                      isGhosted={isGhosted(application)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;