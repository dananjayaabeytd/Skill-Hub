import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { format } from 'date-fns';

const ProgressCard = ({ entry, onEdit, onDelete, isOwner }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <div>
        <h5 className="text-lg font-semibold">{entry.title}</h5>
        <p className="text-sm text-gray-600 mb-1">{entry.description}</p>
        <div className="flex flex-wrap gap-2 text-sm mt-2">
          <Badge color="info">{entry.templateType}</Badge>
          <Badge color="gray">{format(new Date(entry.date), 'yyyy-MM-dd')}</Badge>
        </div>
        {isOwner && (
          <div className="mt-4 flex gap-2">
            <button className="text-blue-600 text-sm" onClick={onEdit}>Edit</button>
            <button className="text-red-600 text-sm" onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProgressCard;
