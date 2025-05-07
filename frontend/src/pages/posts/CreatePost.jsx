import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Textarea,
  Label,
  TextInput,
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
import { useMyContext } from '../../store/ContextApi';

const CreatePost = ({ isOpen, onClose, userId, onPostCreated }) => {
  const [description, setDescription] = useState('');
  const [skillId, setSkillId] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isPublic, setIsPublic] = useState(true); // Default to public posts

  const { currentUser } = useMyContext();
  const currentUserId = currentUser?.id;

  // Fetch user's skills for the dropdown
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserSkills();
    }
  }, [isOpen, userId]);

  const fetchUserSkills = async () => {
    setLoadingSkills(true);
    try {
      const response = await api.get(`/users/skills/${userId}`);
      setSkills(response.data || []);
    } catch (err) {
      console.error('Error fetching user skills', err);
      toast.error('Failed to load your skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      toast.error('You can only upload up to 3 images and videos combined');
      return;
    }
    setImages([...images, ...files]);
  };

  const handleVideoChange = e => {
    const files = Array.from(e.target.files);
    if (files.length + videos.length > 3) {
      toast.error('You can only upload up to 3 images and videos combined');
      return;
    }
    setVideos([...videos, ...files]);
  };

  const removeFile = (type, index) => {
    if (type === 'image') {
      setImages(images.filter((_, i) => i !== index));
    } else {
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  const totalFiles = images.length + videos.length;

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

    if (totalFiles > 3) {
      toast.error('You can only upload up to 3 media files');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Add post data as JSON string
      const postData = JSON.stringify({
        userId,
        description,
        skillId: parseInt(skillId, 10),
        isPublic, // Include privacy setting
      });

      formData.append('postData', postData);

      // Add images and videos
      images.forEach(image => {
        formData.append('image', image);
      });

      videos.forEach(video => {
        formData.append('video', video);
      });

      const response = await api.post('/posts/addPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post created successfully!');

      // Reset form
      setDescription('');
      setSkillId('');
      setImages([]);
      setVideos([]);
      setIsPublic(true); // Reset to default

      // Close modal and notify parent
      onClose();
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (err) {
      console.error('Error creating post', err);
      toast.error('Failed to create post. Please try again.');
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
              Create New Post
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
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Description */}
            <div>
              <Label
                htmlFor='description'
                value="What's on your mind?"
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
                    Loading your skills...
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

            {/* Media Upload */}
            <div className='space-y-4'>
              <Label
                value='Add Media (optional)'
                className='text-gray-700 font-medium block'
              />
              <p className='text-xs text-gray-500'>
                You can upload up to 3 files (images or videos combined)
              </p>

              <div className='flex flex-wrap gap-4'>
                {/* Image upload */}
                <div className='w-full sm:w-auto'>
                  <Label htmlFor='image-upload' className='sr-only'>
                    Upload Images
                  </Label>
                  <FileInput
                    id='image-upload'
                    accept='image/*'
                    onChange={handleImageChange}
                    disabled={totalFiles >= 3}
                    className='hidden'
                    multiple
                  />
                  <Button
                    type='button'
                    color='light'
                    size='sm'
                    onClick={() =>
                      document.getElementById('image-upload').click()
                    }
                    disabled={totalFiles >= 3}
                  >
                    <HiOutlinePhotograph className='mr-2 h-5 w-5' />
                    Add Images
                  </Button>
                </div>

                {/* Video upload */}
                <div className='w-full sm:w-auto'>
                  <Label htmlFor='video-upload' className='sr-only'>
                    Upload Videos
                  </Label>
                  <FileInput
                    id='video-upload'
                    accept='video/*'
                    onChange={handleVideoChange}
                    disabled={totalFiles >= 3}
                    className='hidden'
                    multiple
                  />
                  <Button
                    type='button'
                    color='light'
                    size='sm'
                    onClick={() =>
                      document.getElementById('video-upload').click()
                    }
                    disabled={totalFiles >= 3}
                  >
                    <HiOutlineUpload className='mr-2 h-5 w-5' />
                    Add Videos
                  </Button>
                </div>
              </div>

              {/* File previews */}
              {(images.length > 0 || videos.length > 0) && (
                <div className='mt-4'>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    Selected Files ({totalFiles}/3):
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {images.map((file, index) => (
                      <div key={`img-${index}`} className='relative group'>
                        <div className='h-20 w-20 bg-gray-100 rounded-md overflow-hidden border'>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <button
                          type='button'
                          onClick={() => removeFile('image', index)}
                          className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <HiOutlineX className='h-4 w-4' />
                        </button>
                      </div>
                    ))}

                    {videos.map((file, index) => (
                      <div key={`vid-${index}`} className='relative group'>
                        <div className='h-20 w-20 bg-gray-100 rounded-md overflow-hidden border flex items-center justify-center'>
                          <span className='text-sm text-gray-500 text-center p-1'>
                            Video:{' '}
                            {file.name.length > 10
                              ? `${file.name.substring(0, 10)}...`
                              : file.name}
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeFile('video', index)}
                          className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <HiOutlineX className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className='bg-gray-50 px-6 py-4 flex justify-end gap-2'>
          <Button color='gray' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='purple'
            onClick={handleSubmit}
            disabled={isLoading || !description.trim() || !skillId}
          >
            {isLoading ? (
              <>
                <Spinner size='sm' className='mr-2' />
                Posting...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePost;