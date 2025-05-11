import React, { useState, useEffect, useRef } from 'react';
import { Button, TextInput, Avatar, Spinner } from 'flowbite-react';
import {
  HiOutlineX,
  HiOutlinePaperAirplane,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEmojiHappy,
} from 'react-icons/hi';
import { BsStickies } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useMyContext } from '../../store/ContextApi';

// Sticker collection - you can expand this with more stickers
const STICKERS = [
  {
    id: 'sticker1',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png',
    alt: 'Grinning Face',
  },
  {
    id: 'sticker2',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44d.png',
    alt: 'Thumbs Up',
  },
  {
    id: 'sticker3',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png',
    alt: 'Red Heart',
  },
  {
    id: 'sticker4',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png',
    alt: 'Party Popper',
  },
  {
    id: 'sticker5',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f605.png',
    alt: 'Grinning Face With Sweat',
  },
  {
    id: 'sticker6',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f606.png',
    alt: 'Grinning Squinting Face',
  },
  {
    id: 'sticker7',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f609.png',
    alt: 'Winking Face',
  },
  {
    id: 'sticker8',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60d.png',
    alt: 'Heart Eyes',
  },
  {
    id: 'sticker9',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f642.png',
    alt: 'Slightly Smiling Face',
  },
  {
    id: 'sticker10',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f917.png',
    alt: 'Hugging Face',
  },
  {
    id: 'sticker11',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60e.png',
    alt: 'Sunglasses',
  },
  {
    id: 'sticker12',
    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f973.png',
    alt: 'Partying Face',
  },
];

const Comments = ({ postId, userId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const { currentUser } = useMyContext();
  const currentUserId = currentUser?.id;

  // State for emoji and sticker pickers
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [editSticker, setEditSticker] = useState(null);
  const [editing, setEditing] = useState(false);

  // Reference for handling clicks outside the pickers
  const pickerRef = useRef(null);
  const textInputRef = useRef(null);
  const editInputRef = useRef(null);

  // Fetch comments when the component mounts
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Effect to handle clicks outside the emoji/sticker pickers
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        setShowStickerPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch comments for the current post
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/post/${postId}`);

      // Check if response.data is an array, if not, use empty array
      const commentsData = Array.isArray(response.data) ? response.data : [];

      setComments(commentsData);

      // Get unique user IDs from comments
      const userIds = [
        ...new Set(
          commentsData.map(comment => comment.user?.userId || comment.userId)
        ),
      ].filter(Boolean);

      if (userIds.length > 0) {
        fetchUserDetails(userIds);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details for comment authors
  const fetchUserDetails = async userIds => {
    if (!userIds.length) return;

    try {
      const promises = userIds.map(id => api.get(`/users/profile/${id}`));
      const responses = await Promise.all(promises);

      const userMap = {};
      responses.forEach(response => {
        if (response.data) {
          const userData = response.data;
          userMap[userData.id] = {
            name: userData.userName || 'Unknown User',
            image: userData.profileImage || null,
          };
        }
      });

      setUserDetails(userMap);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle emoji selection - MODIFIED to work with both new and edited comments
  const handleEmojiSelect = emojiData => {
    if (editing) {
      setEditText(prev => prev + emojiData.emoji);
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    } else {
      setNewComment(prev => prev + emojiData.emoji);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
    // Don't close the emoji picker - allow multiple emoji selection
  };

  // Handle emoji picker close - new function to manually close the picker
  const handleCloseEmojiPicker = () => {
    setShowEmojiPicker(false);
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    } else if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  // Handle sticker selection
  const handleStickerSelect = sticker => {
    if (editing) {
      setEditSticker(sticker);
    } else {
      setSelectedSticker(sticker);
    }
    setShowStickerPicker(false);
  };

  // Submit a new comment (with text, emojis, or sticker)
  const handleSubmitComment = async e => {
    e.preventDefault();

    // Validate that we have either text or a sticker
    if (!newComment.trim() && !selectedSticker) return;

    try {
      setSubmitting(true);

      // The backend expects a plain string for the comment text
      // We'll append sticker info to the text if there's a sticker
      let commentText = newComment.trim();

      if (selectedSticker) {
        // We can encode sticker information in the comment text
        // You may want to implement a better solution like updating your backend
        commentText = `${commentText} [sticker:${selectedSticker.url}:${selectedSticker.alt}]`;
      }

      const response = await api.post('/comments', commentText, {
        params: { postId, userId: currentUserId },
      });

      if (response.data) {
        // Process the response to extract sticker info if present
        const newComment = response.data;

        // Check if the comment text contains encoded sticker info and parse it
        if (
          newComment.commentText &&
          newComment.commentText.includes('[sticker:')
        ) {
          const regex = /\[sticker:(.+):(.+?)\]/;
          const match = newComment.commentText.match(regex);

          if (match) {
            // Extract the sticker URL and alt
            const stickerUrl = match[1];
            const stickerAlt = match[2];

            // Remove the sticker tag from the comment text
            newComment.commentText = newComment.commentText
              .replace(regex, '')
              .trim();

            // Add sticker fields to the comment object
            newComment.stickerUrl = stickerUrl;
            newComment.stickerAlt = stickerAlt;
          }
        }

        setComments(prevComments => [newComment, ...prevComments]);
        setNewComment('');
        setSelectedSticker(null);
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async commentId => {
    if (!window.confirm('Are you sure you want to delete this comment?'))
      return;

    try {
      await api.delete(`/comments/user/${currentUserId}/comment/${commentId}`);
      setComments(prevComments =>
        prevComments.filter(comment => comment.commentId !== commentId)
      );
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Start editing a comment
  const handleEditStart = comment => {
    setEditingId(comment.commentId);
    setEditText(comment.commentText || '');
    setEditing(true);

    // If the comment has a sticker, set it in the edit state
    if (comment.stickerUrl && comment.stickerAlt) {
      setEditSticker({
        url: comment.stickerUrl,
        alt: comment.stickerAlt,
      });
    } else {
      setEditSticker(null);
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
    setEditSticker(null);
    setEditing(false);
  };

  // Save edited comment
  const handleEditSave = async commentId => {
    // Validate that we have either text or a sticker
    if (!editText.trim() && !editSticker) return;

    try {
      // The backend expects a plain string for the comment text
      // We'll append sticker info to the text if there's a sticker
      let commentText = editText.trim();

      if (editSticker) {
        // We can encode sticker information in the comment text
        // You may want to implement a better solution like updating your backend
        commentText = `${commentText} [sticker:${editSticker.url}:${editSticker.alt}]`;
      }

      const response = await api.put(
        `/comments/${commentId}`,
        {
          commentText,
        },
        {
          params: { userId: currentUserId },
        }
      );

      if (response.data) {
        // Process the response to extract sticker info if present
        const updatedComment = response.data;

        // Check if the comment text contains encoded sticker info and parse it
        if (
          updatedComment.commentText &&
          updatedComment.commentText.includes('[sticker:')
        ) {
          const regex = /\[sticker:(.+):(.+?)\]/;
          const match = updatedComment.commentText.match(regex);

          if (match) {
            // Extract the sticker URL and alt
            const stickerUrl = match[1];
            const stickerAlt = match[2];

            // Remove the sticker tag from the comment text
            updatedComment.commentText = updatedComment.commentText
              .replace(regex, '')
              .trim();

            // Add sticker fields to the comment object
            updatedComment.stickerUrl = stickerUrl;
            updatedComment.stickerAlt = stickerAlt;
          }
        }

        setComments(prevComments =>
          prevComments.map(comment =>
            comment.commentId === commentId ? updatedComment : comment
          )
        );

        setEditingId(null);
        setEditText('');
        setEditSticker(null);
        setEditing(false);
        toast.success('Comment updated');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  // Parse existing comments for stickers
  const parseCommentForStickers = comment => {
    if (!comment.commentText || typeof comment.commentText !== 'string') {
      return comment;
    }

    const regex = /\[sticker:(.+):(.+?)\]/;
    const match = comment.commentText.match(regex);

    if (match) {
      return {
        ...comment,
        commentText: comment.commentText.replace(regex, '').trim(),
        stickerUrl: match[1],
        stickerAlt: match[2],
      };
    }

    return comment;
  };

  // Format date
  const formatDate = dateString => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Helper function to get user ID from comment
  const getUserIdFromComment = comment => {
    return comment.user?.userId || comment.userId;
  };

  // Toggle emoji picker with context of where it's being used
  const toggleEmojiPicker = (isEditing = false) => {
    setEditing(isEditing);
    setShowEmojiPicker(!showEmojiPicker);
    setShowStickerPicker(false);
  };

  // Toggle sticker picker with context of where it's being used
  const toggleStickerPicker = (isEditing = false) => {
    setEditing(isEditing);
    setShowStickerPicker(!showStickerPicker);
    setShowEmojiPicker(false);
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex justify-between items-center border-b pb-3'>
        <h3 className='text-lg font-semibold'>Comments</h3>
        <Button color='gray' size='sm' pill onClick={onClose}>
          <HiOutlineX className='h-4 w-4' />
        </Button>
      </div>

      {/* Comments List */}
      <div className='flex-grow overflow-y-auto my-4'>
        {loading ? (
          <div className='flex justify-center items-center h-40'>
            <Spinner size='lg' color='purple' />
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className='text-center text-gray-500 py-10'>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className='space-y-4'>
            {comments.map(rawComment => {
              // Parse comment to extract stickers if present
              const comment = parseCommentForStickers(rawComment);
              const commentUserId = getUserIdFromComment(comment);
              const user = userDetails[commentUserId] || {};
              // Only show edit/delete if comment's userId equals currentUserId
              const isOwner =
                commentUserId === currentUserId || commentUserId === userId;

              return (
                <div key={comment.commentId} className='flex space-x-3'>
                  <Avatar
                    size='sm'
                    rounded
                    img={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || 'User'
                      )}&background=random`
                    }
                  />
                  <div className='flex-1 bg-gray-50 rounded-lg p-3'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='font-medium text-sm'>
                          {comment.commentedUserName || 'Unknown User'}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>

                      {isOwner && editingId !== comment.commentId && (
                        <div className='flex space-x-1'>
                          <Button
                            color='gray'
                            size='xs'
                            pill
                            onClick={() => handleEditStart(comment)}
                          >
                            <HiOutlinePencil className='h-3 w-3' />
                          </Button>
                          <Button
                            color='gray'
                            size='xs'
                            pill
                            onClick={() =>
                              handleDeleteComment(comment.commentId)
                            }
                          >
                            <HiOutlineTrash className='h-3 w-3' />
                          </Button>
                        </div>
                      )}
                    </div>

                    {editingId === comment.commentId ? (
                      <div className='mt-2'>
                        {/* Preview edit sticker if selected */}
                        {editSticker && (
                          <div className='flex items-center mb-2'>
                            <img
                              src={editSticker.url}
                              alt={editSticker.alt}
                              className='h-12 w-12 object-contain mr-2'
                            />
                            <Button
                              color='gray'
                              size='xs'
                              pill
                              onClick={() => setEditSticker(null)}
                            >
                              <HiOutlineX className='h-3 w-3' />
                            </Button>
                          </div>
                        )}

                        <TextInput
                          ref={editInputRef}
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className='mb-2'
                        />

                        <div className='flex justify-between items-center'>
                          <div className='flex space-x-1'>
                            <Button
                              type='button'
                              color='gray'
                              size='xs'
                              pill
                              onClick={() => toggleEmojiPicker(true)}
                            >
                              <HiOutlineEmojiHappy className='h-3 w-3' />
                            </Button>

                            <Button
                              type='button'
                              color='gray'
                              size='xs'
                              pill
                              onClick={() => toggleStickerPicker(true)}
                            >
                              <BsStickies className='h-3 w-3' />
                            </Button>
                          </div>

                          <div className='flex space-x-2'>
                            <Button
                              color='gray'
                              size='xs'
                              onClick={handleEditCancel}
                            >
                              Cancel
                            </Button>
                            <Button
                              color='purple'
                              size='xs'
                              onClick={() => handleEditSave(comment.commentId)}
                              disabled={!editText.trim() && !editSticker}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='mt-1'>
                        {comment.commentText && (
                          <p className='text-gray-700'>{comment.commentText}</p>
                        )}

                        {/* Display sticker if available */}
                        {comment.stickerUrl && (
                          <div className='mt-2'>
                            <img
                              src={comment.stickerUrl}
                              alt={comment.stickerAlt || 'Sticker'}
                              className='w-16 h-16 object-contain'
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comment Form with Emoji & Sticker Features */}
      <div className='border-t pt-3'>
        <form onSubmit={handleSubmitComment} className='space-y-2'>
          {/* Preview selected sticker */}
          {selectedSticker && (
            <div className='flex items-center mb-2'>
              <img
                src={selectedSticker.url}
                alt={selectedSticker.alt}
                className='h-12 w-12 object-contain mr-2'
              />
              <Button
                color='gray'
                size='xs'
                pill
                onClick={() => setSelectedSticker(null)}
              >
                <HiOutlineX className='h-3 w-3' />
              </Button>
            </div>
          )}

          <div className='flex items-center'>
            <TextInput
              ref={textInputRef}
              type='text'
              placeholder='Write a comment...'
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className='flex-grow'
              disabled={submitting}
            />
            <div className='flex ml-2 space-x-1'>
              <Button
                type='button'
                color='gray'
                size='sm'
                pill
                onClick={() => toggleEmojiPicker(false)}
              >
                <HiOutlineEmojiHappy className='h-4 w-4' />
              </Button>

              <Button
                type='button'
                color='gray'
                size='sm'
                pill
                onClick={() => toggleStickerPicker(false)}
              >
                <BsStickies className='h-4 w-4' />
              </Button>

              <Button
                type='submit'
                color='purple'
                size='sm'
                disabled={
                  (!newComment.trim() && !selectedSticker) || submitting
                }
              >
                {submitting ? (
                  <Spinner size='sm' />
                ) : (
                  <HiOutlinePaperAirplane className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>

          {/* Emoji Picker with Done Button */}
          {showEmojiPicker && (
            <div
              ref={pickerRef}
              className='absolute bottom-16 right-10 z-50 shadow-lg rounded-lg'
            >
              <div className='relative'>
                <button
                  type='button'
                  className='absolute top-2 right-2 p-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md z-10 hover:bg-purple-200'
                  onClick={handleCloseEmojiPicker}
                >
                  Done
                </button>
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width={300}
                  height={400}
                  lazyLoadEmojis={true}
                  searchPlaceholder='Search emoji...'
                />
              </div>
            </div>
          )}

          {/* Sticker Picker */}
          {showStickerPicker && (
            <div
              ref={pickerRef}
              className='absolute bottom-16 right-10 z-50 bg-white p-3 shadow-lg rounded-lg border'
            >
              <div className='grid grid-cols-4 gap-2'>
                {STICKERS.map(sticker => (
                  <button
                    key={sticker.id}
                    type='button'
                    onClick={() => handleStickerSelect(sticker)}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    <img
                      src={sticker.url}
                      alt={sticker.alt}
                      className='w-10 h-10 object-contain'
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Comments;
