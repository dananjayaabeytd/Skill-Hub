import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, Button, Avatar, Spinner, Dropdown } from 'flowbite-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useMyContext } from '../../store/ContextApi';
import EditPostModal from './EditPostModal';
import {
  HiOutlineThumbUp,
  HiThumbUp,
  HiOutlineChat,
  HiOutlineShare,
  HiOutlineDotsHorizontal,
  HiOutlineEmojiSad,
  HiOutlineClock,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import likeService from '../../services/LikeService ';
import CommentModal from './CommentModal';

// Reusable image component with built-in error handling
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setFallbackAttempt(0);
    setLoadFailed(false);
  }, [src]);

  const handleError = () => {
    // First attempt - try with the LH3 format if it's a Google Drive URL
    if (fallbackAttempt === 0 && imgSrc.includes('drive.google.com')) {
      const fileIdMatch =
        imgSrc.match(/id=([^&]+)/) || imgSrc.match(/\/d\/([^/]+)/);

      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        console.log(
          'Trying alternative Google URL format with fileId:',
          fileId
        );
        setImgSrc(`https://lh3.googleusercontent.com/d/${fileId}`);
        setFallbackAttempt(1);
        return;
      }
    }

    // Second attempt - try with the thumbnail format
    else if (
      fallbackAttempt === 1 &&
      imgSrc.includes('googleusercontent.com')
    ) {
      const fileId = imgSrc.split('/d/')[1];
      if (fileId) {
        console.log('Trying thumbnail format with fileId:', fileId);
        setImgSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`);
        setFallbackAttempt(2);
        return;
      }
    }

    // All attempts failed, use placeholder
    console.log('All image load attempts failed, using placeholder');
    setImgSrc('/images/image-placeholder.png');
    setLoadFailed(true);
  };

  return (
    <div className='relative'>
      <img src={imgSrc} alt={alt} className={className} onError={handleError} />
      {loadFailed && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50'>
          <span className='text-xs text-gray-500'>Image unavailable</span>
        </div>
      )}
    </div>
  );
};

const PostList = ({
  userId,
  showCreateButton = false,
  onCreateClick,
  publicOnly = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(null); // Track which post's menu is open
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    postId: null,
  });
  const [processingLike, setProcessingLike] = useState(null);
  const [currentSlides, setCurrentSlides] = useState({});
  const { currentUser } = useMyContext();
  const currentUserId = currentUser.id;
  const currnetUserName = currentUser.username;

  const [editModal, setEditModal] = useState({
    isOpen: false,
    postId: null,
  });

  const handleEditPost = postId => {
    setEditModal({ isOpen: true, postId });
    setMenuOpen(null); // Close the dropdown menu
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, postId: null });
  };

  const handlePostUpdated = () => {
    // Refresh the post list after update
    fetchPosts();
    toast.success('Post updated successfully');
  };

  const getOptimizedDriveUrl = url => {
    if (!url) return '';

    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      try {
        let fileId = null;

        // Format: https://drive.google.com/uc?export=view&id=FILE_ID
        if (url.includes('uc?export=view&id=')) {
          fileId = url.match(/id=([^&]+)/)?.[1];
        }
        // Format: https://drive.google.com/file/d/FILE_ID/view
        else if (url.includes('/file/d/') || url.includes('/d/')) {
          const rawUrl1 = url.split('/d/');
          if (rawUrl1.length > 1) {
            const rawUrl2 = rawUrl1[1].split('/view');
            fileId = rawUrl2[0];
          }
        }

        if (fileId) {
          // Use direct embed URL through Google's sites service which allows embedding
          return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
      } catch (error) {
        console.error('Error optimizing Drive URL:', error);
      }
    }

    return url;
  };

  // Handle slide navigation
  const handleSlideChange = (postId, direction) => {
    setCurrentSlides(prev => {
      const mediaItems = posts.find(p => p.postId === postId)?.media || [];
      const currentIndex = prev[postId] || 0;

      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % mediaItems.length;
      } else {
        newIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
      }

      return { ...prev, [postId]: newIndex };
    });
  };

  // Fetch posts by user ID
  const fetchPosts = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await api.get(`/posts/user/${userId}`);
      const postsData = response.data || [];

      // Check the data structure
      if (Array.isArray(postsData)) {
        // Filter posts based on publicOnly prop
        const filteredPosts = publicOnly
          ? postsData.filter(post => post.isPublic === true)
          : postsData;

        setPosts(filteredPosts);

        // Fetch user details for each unique user in posts
        const uniqueUserIds = [
          ...new Set(filteredPosts.map(post => post.userId)),
        ];
        fetchUsersDetails(uniqueUserIds);

        // Fetch likes information
        filteredPosts.forEach(post => {
          fetchPostLikes(post.postId);
        });
      } else {
        console.error('Unexpected posts data format:', postsData);
        setError('Received invalid data format from server');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(`Failed to load posts: ${err.message || 'Unknown error'}`);
      toast.error('Could not load posts');
    } finally {
      setLoading(false);
    }
  }, [userId, publicOnly]); // Add publicOnly to dependencies

  // Fetch post like information
  const fetchPostLikes = async postId => {
    try {
      // Get like count
      const count = await likeService.getLikesCount(postId);
      setLikeCounts(prev => ({
        ...prev,
        [postId]: count,
      }));

      // Check if current user liked this post
      if (userId) {
        const hasLiked = await likeService.getUserLike(postId, userId);
        setLikedPosts(prev => ({
          ...prev,
          [postId]: hasLiked,
        }));
      }
    } catch (error) {
      console.error('Error fetching like information:', error);
    }
  };

  // Handle like/unlike
  const handleLikeToggle = async postId => {
    if (processingLike === postId) return; // Prevent double clicks

    setProcessingLike(postId);
    try {
      const isLiked = likedPosts[postId];

      if (isLiked) {
        await likeService.unlikePost(postId, userId);
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setLikeCounts(prev => ({
          ...prev,
          [postId]: Math.max(0, prev[postId] - 1),
        }));
      } else {
        await likeService.likePost(postId, userId);
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to process your like');
    } finally {
      setProcessingLike(null);
    }
  };

  // Open comment modal
  const handleCommentClick = postId => {
    setCommentModal({ isOpen: true, postId });
  };

  // Close comment modal
  const handleCloseCommentModal = () => {
    setCommentModal({ isOpen: false, postId: null });
  };

  // Fetch user details for posts
  const fetchUsersDetails = async userIds => {
    if (!userIds || userIds.length === 0) return;

    try {
      // Update this API endpoint to match your backend
      const promises = userIds.map(id => api.get(`/users/profile/${id}`));
      const responses = await Promise.all(promises);

      const userMap = {};
      responses.forEach(response => {
        if (response.data) {
          userMap[response.data.id] = {
            name: response.data.userName || 'Unknown User',
            image: response.data.profileImage || null,
            role: response.data.role?.roleName || 'Member',
          };
        }
      });

      setUserDetails(userMap);
    } catch (err) {
      console.error('Error fetching user details:', err);
      // Still proceed with the posts even if user details fail
    }
  };

  const handleDeletePost = async postId => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // Implement your delete API call
        await api.delete(`/posts/${postId}`);
        toast.success('Post deleted successfully');
        // Update the UI by removing the deleted post
        setPosts(posts.filter(p => p.postId !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
      setMenuOpen(null);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Format date for display
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return 'Unknown date';
    }
  };

  const renderMedia = (mediaItems, postId) => {
    if (
      !mediaItems ||
      mediaItems.length === 0 ||
      (mediaItems.length === 1 && !mediaItems[0]?.mediaUrl)
    ) {
      return (
        <div className='text-xs text-gray-400 italic'>No media attached</div>
      );
    }

    // Filter out media items with null URLs
    const validMediaItems = mediaItems.filter(media => media?.mediaUrl);

    if (validMediaItems.length === 0) {
      return (
        <div className='text-xs text-gray-400 italic'>No media attached</div>
      );
    }

    // For a single media item, render as before
    if (validMediaItems.length === 1) {
      const media = validMediaItems[0];
      const optimizedUrl = getOptimizedDriveUrl(media.mediaUrl);

      if (media.mediaType === 'PHOTO' || media.mediaType.startsWith('image/')) {
        return (
          <div className='mt-3 rounded-lg overflow-hidden bg-gray-100'>
            <ImageWithFallback
              src={optimizedUrl}
              alt='Post content'
              className='w-full h-auto max-h-96 object-contain'
            />
          </div>
        );
      } else if (
        media.mediaType === 'VIDEO' ||
        media.mediaType.startsWith('video/')
      ) {
        return (
          <div className='mt-3 rounded-lg overflow-hidden'>
            <video controls className='w-full h-auto max-h-96'>
              <source src={optimizedUrl} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
    }

    // For multiple media items, render a slider
    const currentIndex = currentSlides[postId] || 0;
    const currentMedia = validMediaItems[currentIndex];
    const optimizedUrl = getOptimizedDriveUrl(currentMedia?.mediaUrl);

    return (
      <div className='mt-3 rounded-lg overflow-hidden bg-gray-100 relative'>
        {/* Current media display */}
        {currentMedia.mediaType === 'PHOTO' ||
        currentMedia.mediaType.startsWith('image/') ? (
          <ImageWithFallback
            src={optimizedUrl}
            alt={`Post content ${currentIndex + 1} of ${
              validMediaItems.length
            }`}
            className='w-full h-auto max-h-96 object-contain'
          />
        ) : (
          <video controls className='w-full h-auto max-h-96'>
            <source src={optimizedUrl} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Navigation buttons */}
        <div className='absolute inset-0 flex items-center justify-between px-2'>
          <button
            onClick={e => {
              e.stopPropagation();
              handleSlideChange(postId, 'prev');
            }}
            className='bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10'
            aria-label='Previous image'
          >
            <HiChevronLeft className='h-6 w-6' />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              handleSlideChange(postId, 'next');
            }}
            className='bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10'
            aria-label='Next image'
          >
            <HiChevronRight className='h-6 w-6' />
          </button>
        </div>

        {/* Slide indicator */}
        <div className='absolute bottom-2 left-0 right-0 flex justify-center space-x-2'>
          {validMediaItems.map((_, index) => (
            <button
              key={index}
              onClick={e => {
                e.stopPropagation();
                setCurrentSlides(prev => ({ ...prev, [postId]: index }));
              }}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter indicator */}
        <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full'>
          {currentIndex + 1} / {validMediaItems.length}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <Spinner size='xl' color='purple' />
        <p className='mt-4 text-gray-600'>Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='text-center py-16 bg-gray-50 rounded-lg border border-gray-200'>
        <HiOutlineEmojiSad className='mx-auto h-12 w-12 text-gray-400' />
        <p className='mt-4 text-gray-800 font-medium'>{error}</p>
        <Button color='purple' size='sm' className='mt-4' onClick={fetchPosts}>
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className='space-y-4'>
        {showCreateButton && (
          <div className='flex justify-end mb-4'>
            <Button color='purple' onClick={onCreateClick}>
              Create New Post
            </Button>
          </div>
        )}

        <div className='text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
            />
          </svg>
          <p className='mt-2 text-gray-600 font-medium'>No posts yet</p>
          <p className='mt-1 text-sm text-gray-500'>
            When you create posts, they will appear here
          </p>
        </div>
      </div>
    );
  }

  // Posts list
  return (
    <div className='space-y-6'>
      {/* Show comment modal */}
      <CommentModal
        isOpen={commentModal.isOpen}
        onClose={handleCloseCommentModal}
        postId={commentModal.postId}
        userId={userId}
      />

      <EditPostModal
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        postId={editModal.postId}
        onPostUpdated={handlePostUpdated}
      />

      {/* Rest of your existing code */}
      {showCreateButton && (
        <div className='flex justify-end mb-4'>
          <Button color='purple' onClick={onCreateClick}>
            Create New Post
          </Button>
        </div>
      )}

      {posts.map(post => {
        const user = userDetails[post.userId] || {};
        const isLiked = likedPosts[post.postId] || false;
        const likeCount = likeCounts[post.postId] || 0;

        return (
          <motion.div
            key={post.postId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='overflow-hidden'>
              {/* Post Header */}
              <div className='flex justify-between'>
                <div className='flex items-center'>
                  <Avatar
                    size='md'
                    rounded
                    img={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || 'User'
                      )}&background=random`
                    }
                    className='mr-3 ring-2 ring-purple-50'
                  />
                  <div>
                    <div className='flex items-center'>
                      <h5 className='font-bold text-gray-800'>
                        {currnetUserName}
                      </h5>
                      {user.role && (
                        <Badge color='purple' className='ml-2 text-xs'>
                          {user.role}
                        </Badge>
                      )}
                    </div>

                    {post.skillName && (
                      <div className='flex items-center mt-0.5'>
                        <Badge
                          color='indigo'
                          className='bg-indigo-100 text-indigo-800 font-medium px-2.5 py-0.5 rounded text-xs'
                        >
                          <span className='flex items-center'>
                            <svg
                              className='w-3 h-3 mr-1'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
                            </svg>
                            {post.skillName}
                          </span>
                        </Badge>
                      </div>
                    )}

                    <div className='flex items-center text-xs text-gray-500 mt-0.5'>
                      <HiOutlineClock className='mr-1' />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Button color='gray' size='xs' pill>
                    <div>
                      {post.userId === currentUserId ? (
                        <Dropdown
                          arrowIcon={false}
                          inline
                          label={
                            <Button color='gray' size='xs' pill>
                              <HiOutlineDotsHorizontal />
                            </Button>
                          }
                          isOpen={menuOpen === post.postId}
                          onClickOutside={() => setMenuOpen(null)}
                          onClick={() =>
                            setMenuOpen(
                              menuOpen === post.postId ? null : post.postId
                            )
                          }
                        >
                          <Dropdown.Item
                            onClick={() => handleEditPost(post.postId)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleDeletePost(post.postId)}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown>
                      ) : (
                        <Button color='gray' size='xs' pill>
                          <HiOutlineDotsHorizontal />
                        </Button>
                      )}
                    </div>
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className='mt-2'>
                {post.description && (
                  <p className='text-gray-600 whitespace-pre-line mb-3'>
                    {post.description}
                  </p>
                )}

                {renderMedia(post.media, post.postId)}
              </div>

              {/* Post Footer */}
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex justify-between'>
                  <div className='flex space-x-4'>
                    <Button
                      color={isLiked ? 'purple' : 'light'}
                      size='sm'
                      className={isLiked ? 'text-white' : 'text-gray-600'}
                      onClick={() => handleLikeToggle(post.postId)}
                      disabled={processingLike === post.postId}
                    >
                      {isLiked ? (
                        <HiThumbUp className='mr-1' />
                      ) : (
                        <HiOutlineThumbUp className='mr-1' />
                      )}
                      {likeCount > 0 ? `${likeCount}` : 'Like'}
                    </Button>

                    <Button
                      color='light'
                      size='sm'
                      className='text-gray-600'
                      onClick={() => handleCommentClick(post.postId)}
                    >
                      <HiOutlineChat className='mr-1' />
                      Comment
                    </Button>
                  </div>
                  <Button color='light' size='sm' className='text-gray-600'>
                    <HiOutlineShare className='mr-1' />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PostList;
