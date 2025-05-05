import React from 'react';
import { Badge, Avatar } from 'flowbite-react';
import { format } from 'date-fns';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

const ProgressCard = ({ entry, isOwner, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-300 p-4 bg-white shadow-sm hover:shadow-md transition">
      {/* User Info */}
      <div className="flex items-center mb-3">
        <Avatar
          size="sm"
          rounded
          img={
            entry.userImage && entry.userImage.trim() !== ''
              ? entry.userImage
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.userName)}&background=random`
          }
          alt={entry.userName}
        />
        <span className="ml-3 text-sm font-medium text-gray-800">
          {entry.userName}
        </span>
      </div>

      {/* Entry Content */}
      <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
      <p className="text-sm text-gray-700 mt-1 mb-2 whitespace-pre-line">{entry.description}</p>

      <div className="flex flex-wrap gap-2 text-sm mb-3">
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
    </div>
  );
};

export default ProgressCard;
