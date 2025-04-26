import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMyContext } from '../../store/ContextApi';
import {
  Button,
  Textarea,
  Label,
  Spinner,
  Select,
  FileInput,
  ToggleSwitch,
} from 'flowbite-react';
import toast from 'react-hot-toast';
import {
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineUpload,
  HiOutlineLockClosed,
  HiOutlineGlobe,
} from 'react-icons/hi';
import api from '../../services/api';

const EditPostModal = ({ isOpen, onClose, postId, onPostUpdated }) => {
  const [description, setDescription] = useState('');
  const [skillId, setSkillId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [currentPost, setCurrentPost] = useState(null);
    const { currentUser } = useMyContext();
    const currentUserId = currentUser.id;

  // Fetch post details when modal opens
  useEffect(() => {
    if (isOpen && postId) {
      // First fetch skills, then fetch post details
      const loadData = async () => {
        await fetchUserSkills();
        await fetchPostDetails();
      };
      loadData();
    }
  }, [isOpen, postId]);

  // Fetch the post details
  const fetchPostDetails = async () => {
    setFetchingPost(true);
    try {
      const response = await api.get(`/posts/${postId}`);
      const post = response.data;
      
      setCurrentPost(post);
      setDescription(post.description || '');
      
      // Find the skillId that matches the skillName
      if (post.skillName && skills.length > 0) {
        const matchingSkill = skills.find(skill => 
          skill.skillName.toLowerCase() === post.skillName.toLowerCase()
        );
        if (matchingSkill) {
          setSkillId(matchingSkill.skillId.toString());
        } else {
          console.warn('Could not find matching skill ID for:', post.skillName);
        }
      }
      
      setIsPublic(post.isPublic !== false);
    } catch (err) {
      console.error('Error fetching post details', err);
      toast.error('Failed to load post details');
    } finally {
      setFetchingPost(false);
    }
  };

  // Fetch user skills for dropdown
  const fetchUserSkills = async () => {
    setLoadingSkills(true);
    try {
      const response = await api.get(`/users/skills/${currentUser.id}`);
      setSkills(response.data || []);
      return response.data || [];
    } catch (err) {
      console.error('Error fetching user skills', err);
      toast.error('Failed to load skills');
      return [];
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
  
    if (!skillId) {
      toast.error('Please select a skill');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Verify auth first
      console.log('Authentication check: JWT exists =', !!localStorage.getItem('JWT_TOKEN'));
      console.log('Authentication check: CSRF TOKEN exists =', !!localStorage.getItem('CSRF_TOKEN'));
      
      // Prepare update data according to the backend's expected structure
      // Notice the field names match the PostDTO structure used in your addPost method
      const updatedPost = {
        userId: currentUserId,  // Include directly in the object, not as a query param
        description: description,
        skillId: parseInt(skillId, 10), // Send skillId directly, not in a nested object
        isPublic: isPublic
      };
  
      // Send update request to the correct endpoint path
      await api.put(`/posts/update/${postId}`, updatedPost);
  
      toast.success('Post updated successfully!');
      
      // Close modal and notify parent component
      onClose();
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (err) {
      console.error('Error updating post', err);
      console.error('Status:', err.response?.status);
      console.error('Error details:', err.response?.data);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <motion.div
        className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className='bg-white rounded-lg shadow-xl w-full max-w-2xl z-10 overflow-hidden'
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex justify-between items-center border-b px-6 py-4'>
          <div className='flex items-center'>
            <HiOutlineDocumentText className='text-purple-600 mr-2 h-6 w-6' />
            <h3 className='text-xl font-medium text-gray-900'>
              Edit Post
            </h3>
          </div>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
            aria-label='Close'
          >
            <HiOutlineX className='h-5 w-5' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='px-6 py-4'>
          {fetchingPost ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Spinner size='lg' color='purple' />
              <p className='mt-4 text-gray-600'>Loading post details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Description */}
              <div>
                <Label
                  htmlFor='description'
                  value='Post Content'
                  className='text-gray-700 font-medium mb-2'
                />
                <Textarea
                  id='description'
                  placeholder='Share your thoughts, experience or questions...'
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className='w-full'
                  required
                />
              </div>

              {/* Skill Selection */}
              <div>
                <Label
                  htmlFor='skill'
                  value='Related Skill'
                  className='text-gray-700 font-medium mb-2'
                />
                {loadingSkills ? (
                  <div className='flex items-center gap-2'>
                    <Spinner size='sm' />
                    <span className='text-sm text-gray-500'>
                      Loading skills...
                    </span>
                  </div>
                ) : (
                  <Select
                    id='skill'
                    value={skillId}
                    onChange={e => setSkillId(e.target.value)}
                    required
                  >
                    <option value=''>Select a skill</option>
                    {skills.map(skill => (
                      <option key={skill.skillId} value={skill.skillId}>
                        {skill.skillName}
                      </option>
                    ))}
                  </Select>
                )}
              </div>

              {/* Privacy Setting */}
              <div>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <Label
                      htmlFor='privacy'
                      value='Post Privacy'
                      className='text-gray-700 font-medium mb-1'
                    />
                    <span className='text-xs text-gray-500'>
                      {isPublic ? 'Everyone can see this post' : 'Only you can see this post'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-500 flex items-center'>
                      {isPublic ? <HiOutlineGlobe className='h-4 w-4 text-green-500 mr-1' /> : <HiOutlineLockClosed className='h-4 w-4 text-amber-500 mr-1' />}
                      {isPublic ? 'Public' : 'Private'}
                    </span>
                    <ToggleSwitch
                      id='privacy'
                      checked={isPublic}
                      onChange={setIsPublic}
                      label=""
                    />
                  </div>
                </div>
              </div>

              {/* Media note */}
              <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> To change media attachments, please delete this post and create a new one.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className='bg-gray-50 px-6 py-4 flex justify-end gap-2'>
          <Button color='gray' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='purple'
            onClick={handleSubmit}
            disabled={isLoading || fetchingPost || !description.trim() || !skillId}
          >
            {isLoading ? (
              <>
                <Spinner size='sm' className='mr-2' />
                Updating...
              </>
            ) : (
              'Update Post'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPostModal;