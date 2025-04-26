import React, { useState, useEffect } from 'react';
import { Button, TextInput, Avatar, Spinner } from 'flowbite-react';
import { HiOutlineX, HiOutlinePaperAirplane, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useMyContext } from '../../store/ContextApi';

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

  // Fetch comments when the component mounts
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);
  
  // Fetch comments for the current post
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/post/${postId}`);
      
      // Check if response.data is an array, if not, use empty array
      const commentsData = Array.isArray(response.data) ? response.data : [];
      console.log("Comments data:", commentsData);
      
      setComments(commentsData);
      
      // Get unique user IDs from comments
      const userIds = [...new Set(commentsData.map(comment => 
        comment.user?.userId || comment.userId
      ))].filter(Boolean);
      
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
  const fetchUserDetails = async (userIds) => {
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
  
  // Submit a new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await api.post('/comments', newComment, {
        params: { postId, userId }
      });
      
      // Make sure to check the response format
      if (response.data) {
        setComments(prevComments => [response.data, ...prevComments]);
        setNewComment('');
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
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await api.delete(`/comments/user/${userId}/comment/${commentId}`);
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
  const handleEditStart = (comment) => {
    setEditingId(comment.commentId);
    setEditText(comment.commentText);
  };
  
  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };
  
  // Save edited comment
  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    
    try {
      const response = await api.put(`/comments/${commentId}`, editText, {
        params: { userId }
      });
      
      if (response.data) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.commentId === commentId ? response.data : comment
          )
        );
        
        setEditingId(null);
        setEditText('');
        toast.success('Comment updated');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Helper function to get user ID from comment
  const getUserIdFromComment = (comment) => {
    return comment.user?.userId || comment.userId;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Button color="gray" size="sm" pill onClick={onClose}>
          <HiOutlineX className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Comments List */}
      <div className="flex-grow overflow-y-auto my-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" color="purple" />
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const commentUserId = getUserIdFromComment(comment);
              const user = userDetails[commentUserId] || {};
              const isOwner = commentUserId === userId || currentUserId;
              
              return (
                <div key={comment.commentId} className="flex space-x-3">
                  <Avatar
                    size="sm"
                    rounded
                    img={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || 'User'
                      )}&background=random`
                    }
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{comment.commentedUserName || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                      
                      {isOwner && editingId !== comment.commentId && (
                        <div className="flex space-x-1">
                          <Button
                            color="gray"
                            size="xs"
                            pill
                            onClick={() => handleEditStart(comment)}
                          >
                            <HiOutlinePencil className="h-3 w-3" />
                          </Button>
                          <Button
                            color="gray"
                            size="xs"
                            pill
                            onClick={() => handleDeleteComment(comment.commentId)}
                          >
                            <HiOutlineTrash className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {editingId === comment.commentId ? (
                      <div className="mt-2">
                        <TextInput
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            color="gray"
                            size="xs"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="purple"
                            size="xs"
                            onClick={() => handleEditSave(comment.commentId)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-700">{comment.commentText}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Comment Form */}
      <div className="border-t pt-3">
        <form onSubmit={handleSubmitComment} className="flex items-center">
          <TextInput
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow"
            disabled={submitting}
          />
          <Button
            type="submit"
            color="purple"
            size="sm"
            disabled={!newComment.trim() || submitting}
            className="ml-2"
          >
            {submitting ? (
              <Spinner size="sm" />
            ) : (
              <HiOutlinePaperAirplane className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Comments;