import React from 'react';
import { Badge, Avatar } from 'flowbite-react';
import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

const getPostTimeLabel = (dateStr) => {
  const postDate = new Date(dateStr);
  if (isToday(postDate)) return 'Posted today';
  if (isYesterday(postDate)) return 'Posted yesterday';
  const diff = differenceInCalendarDays(new Date(), postDate);
  return `Posted ${diff} days ago`;
};

const extractHashtags = (text) => {
  return (text.match(/#[\w]+/g) || []).slice(0, 5);
};

const removeHashtags = (text) => {
  return text.replace(/#[\w]+/g, '').trim();
};

const splitResources = (resourceStr) => {
  if (!resourceStr) return [];
  return resourceStr.trim().split(/\s+/); // split on whitespace
};

const imageMap = {
  CERTIFICATE: '/images/certificate-template.jpg',
  MILESTONE: '/images/milestone-template.jpg',
  PROJECT: '/images/progress-templates/project1.jpg',
  WORKSHOP: '/images/progress-templates/workshop1.jpg',
};

const ProgressCard = ({ entry, user, isOwner, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-300 p-4 bg-white shadow-sm hover:shadow-md transition rounded-lg">
      {/* User Info */}
      <div className="flex items-center mb-3">
        <Avatar
          size="sm"
          rounded
          img={
            user?.userImage?.trim()
              ? user.userImage
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.userName)}&background=random`
          }
          alt={user?.userName}
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-800">{user?.userName}</p>
          <p className="text-xs text-gray-500">{getPostTimeLabel(entry.date)}</p>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
      <p className="text-sm text-gray-700 mt-1 mb-2 whitespace-pre-line">
        {removeHashtags(entry.description)}
      </p>

      {/* Image */}
      {entry.mediaUrls?.length > 0 && (
        <>
          <img
            src={entry.mediaUrls[0]}
            alt="Progress"
            className="w-full h-[400px] object-cover rounded-md mb-3"
          />

          {/* Resources */}
          {splitResources(entry.resource).length > 0 && (
            <div className="mb-3 space-y-1">
              <p className="text-sm font-semibold text-gray-700">Resources:</p>
              {splitResources(entry.resource).map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline break-words"
                >
                  🔗 {link}
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* Hashtags */}
      {extractHashtags(entry.description).length > 0 && (
        <div className="text-sm text-blue-600 font-medium mb-2 mt-5">
          {extractHashtags(entry.description).map((tag, i) => (
            <span key={i} className="mr-2">{tag}</span>
          ))}
        </div>
      )}

      {/* Metadata Badges */}
      <div className="flex flex-wrap gap-2 text-sm mb-3">
        <Badge color="info">{entry.templateType}</Badge>
        <Badge color="gray">{getPostTimeLabel(entry.date)}</Badge>
      </div>

      {/* Meta Info */}
      <p className="text-xs text-gray-500">
        Plan ID: {entry.planId} | User ID: {entry.userId}
      </p>

      {/* Edit/Delete Buttons */}
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



