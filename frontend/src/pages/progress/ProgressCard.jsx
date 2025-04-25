import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { format } from 'date-fns';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

const ProgressCard = ({ entry, isOwner, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{entry.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
      <div className="flex flex-wrap gap-2 text-sm mb-2">
        <Badge color="info">{entry.templateType}</Badge>
        <Badge color="gray">{format(new Date(entry.date), 'yyyy-MM-dd')}</Badge>
      </div>
      <p className="text-xs text-gray-500">
        Plan ID: {entry.planId} | User ID: {entry.userId}
      </p>

      {isOwner && (
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition"
          >
            <HiOutlinePencilAlt className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full transition"
          >
            <HiOutlineTrash className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </Card>
  );
};

export default ProgressCard;
