import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  Spinner,
  Button,
  Avatar,
  Badge,
  Tabs,
  Modal,
} from 'flowbite-react';
import {
  HiOutlineMail,
  HiOutlineLightningBolt,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineX,
  HiOutlineExternalLink,
} from 'react-icons/hi';

import api from '../../services/api';
import Errors from '../../components/Error';
import { useMyContext } from '../../store/ContextApi';
import CreatePost from '../posts/CreatePost';
import PostList from '../posts/PostList';

const MyWall = () => {
  const { currentUser } = useMyContext();
  const userId = currentUser?.id;

  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState(null);

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  // Inside the MyWall component, add this state
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const navigate = useNavigate();

  const handlePostCreated = newPost => {
    toast.success('Post created successfully!');
    // If you have a posts state, you could update it here
    // setUserPosts(prev => [newPost, ...prev]);
  };

  const fetchFollowers = async () => {
    if (!userId) return;

    setLoadingFollowers(true);
    try {
      const response = await api.get(`/followers/${userId}/list`);
      setFollowersData(response.data || []);
    } catch (err) {
      console.error('Error fetching followers', err);
      toast.error('Failed to load followers');
    } finally {
      setLoadingFollowers(false);
    }
  };

  // Fetch following data for modal
  const fetchFollowing = async () => {
    if (!userId) return;

    setLoadingFollowing(true);
    try {
      const response = await api.get(`/followers/${userId}/following`);
      setFollowingData(response.data || []);
    } catch (err) {
      console.error('Error fetching following', err);
      toast.error('Failed to load following');
    } finally {
      setLoadingFollowing(false);
    }
  };

  // Handle opening followers modal
  const handleOpenFollowersModal = () => {
    fetchFollowers();
    setShowFollowersModal(true);
  };

  // Handle opening following modal
  const handleOpenFollowingModal = () => {
    fetchFollowing();
    setShowFollowingModal(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  // Fetch user profile
  const fetchUserDetails = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError('You need to be logged in to view your wall');
      return;
    }

    try {
      const response = await api.get(`/users/profile/${userId}`);
      if (response.data) {
        setUser(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching user details', err);
      toast.error('Error fetching your profile');
      setError('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch user skills
  const fetchUserSkills = useCallback(async () => {
    if (!userId) return;

    setLoadingSkills(true);
    try {
      const response = await api.get(`/users/skills/${userId}`);
      setSkills(response.data || []);
    } catch (err) {
      console.error('Error fetching user skills', err);
    } finally {
      setLoadingSkills(false);
    }
  }, [userId]);

  // Fetch social stats
  const fetchSocialStats = useCallback(async () => {
    if (!userId) return;

    try {
      // Try-catch each request separately to prevent one failure from stopping others
      try {
        const followersResponse = await api.get(`/followers/count/${userId}`);
        setFollowersCount(followersResponse.data || 0);
      } catch (err) {
        console.error('Error fetching followers count', err);
        setFollowersCount(0);
      }

      try {
        const followingResponse = await api.get(
          `/followers/following/count/${userId}`
        );
        setFollowingCount(followingResponse.data || 0);
      } catch (err) {
        console.error('Error fetching following count', err);
        setFollowingCount(0);
      }
    } catch (err) {
      console.error('Error fetching social stats', err);
    }
  }, [userId]);

  // Get user status badge
  const getUserStatusBadge = () => {
    if (!user) return null;

    if (user.enabled && user.accountNonLocked && user.accountNonExpired) {
      return <Badge color='success'>Active</Badge>;
    } else {
      return <Badge color='gray'>Inactive</Badge>;
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchUserDetails();
    fetchUserSkills();
    fetchSocialStats();
  }, [fetchUserDetails, fetchUserSkills, fetchSocialStats]);

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center h-64'>
        <Spinner size='xl' color='info' />
        <p className='mt-4 text-gray-600'>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return <Errors message={error} />;
  }

  if (!user) {
    return (
      <div className='text-center py-16'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Profile not available
        </h2>
        <p className='text-gray-600 mt-2'>Please log in to view your wall.</p>
        <Button
          color='purple'
          className='mt-4'
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='p-6 bg-gray-50 min-h-screen'
    >
      <div className='max-w-4xl mx-auto'>
        {/* User Profile Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className='mb-6 overflow-hidden border-0 shadow-lg'>
            {/* Decorative header banner */}
            <div className='relative'>
              <div className='h-32 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 w-full'></div>

              {/* Overlapping avatar */}
              <div className='absolute left-6 -bottom-12 ring-4 ring-white rounded-full shadow-xl'>
                <Avatar
                  size='xl'
                  rounded
                  img={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.userName
                  )}&background=random&size=150&bold=true`}
                  className='border-4 border-white'
                />
              </div>
            </div>

            {/* Profile content with proper spacing */}
            <div className='pt-16 px-6 pb-6'>
              <div className='flex flex-col md:flex-row justify-between'>
                {/* User info with improved typography */}
                <div className='mb-6 md:mb-0'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex flex-wrap items-center gap-3 mb-2'
                  >
                    {/* Username with text reveal animation */}
                    <motion.h1
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600'
                    >
                      {user.userName}
                    </motion.h1>

                    {/* "You" badge */}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: 'spring',
                        stiffness: 500,
                      }}
                      className='text-sm text-white bg-purple-500 py-0.5 px-3 rounded-full font-medium shadow-sm'
                    >
                      You
                    </motion.span>

                    {/* Premium badge with shimmer effect */}
                    {user.premium && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.4,
                          type: 'spring',
                          stiffness: 120,
                          damping: 10,
                        }}
                        className='relative overflow-hidden'
                      >
                        <div className='absolute inset-0 z-10'>
                          <motion.div
                            initial={{ x: -100 }}
                            animate={{ x: 100 }}
                            transition={{
                              repeat: Infinity,
                              repeatType: 'loop',
                              duration: 2,
                              ease: 'linear',
                              delay: 1,
                            }}
                            className='w-20 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-20'
                          />
                        </div>
                        <div className='flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full py-1 px-4 shadow-md relative z-0'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                            className='w-4 h-4 mr-1.5 text-white'
                          >
                            <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
                          </svg>
                          <span className='text-xs font-bold text-white'>
                            Premium
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Premium membership details with animated entry */}
                  {user.premium && user.lastPaymentDateTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        transition: {
                          height: {
                            delay: 0.6,
                            duration: 0.4,
                          },
                          opacity: {
                            delay: 0.8,
                            duration: 0.4,
                          },
                        },
                      }}
                      className='overflow-hidden'
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 1,
                            type: 'spring',
                            stiffness: 100,
                            damping: 20,
                          },
                        }}
                        className='mt-1.5 mb-3'
                      >
                        <div className='flex items-center'>
                          <div className='relative'>
                            <div className='absolute inset-0 bg-amber-300 rounded-full animate-pulse opacity-30'></div>
                            <div className='bg-gradient-to-br from-amber-100 to-amber-50 rounded-full p-1.5 border border-amber-300 shadow-inner'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4 text-amber-600'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                          </div>
                          <div className='ml-2.5'>
                            <span className='text-xs uppercase tracking-wider font-medium text-amber-700'>
                              Premium member since
                            </span>
                            <div className='text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent'>
                              {new Date(
                                user.lastPaymentDateTime
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  <p className='text-gray-600 flex items-center mt-1.5 font-medium'>
                    <HiOutlineMail className='mr-2 text-purple-500' />
                    {user.email}
                  </p>

                  <div className='flex items-center mt-3 space-x-2'>
                    <Badge
                      color='purple'
                      size='sm'
                      className='capitalize font-medium px-3 py-1.5'
                    >
                      {user.role?.roleName?.toLowerCase() || 'Member'}
                    </Badge>
                    <span className='mx-1 text-gray-300'>•</span>
                    {getUserStatusBadge()}
                  </div>

                  {/* Member since - moved to here for better flow */}
                  <div className='mt-3 text-sm text-gray-500 flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 mr-1.5 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    <span>
                      Member since:{' '}
                      <span className='font-medium text-gray-700'>
                        {user.createdDate
                          ? new Date(user.createdDate).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                          : 'N/A'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Stats with card design */}
                <div className='flex flex-col space-y-4'>
                  <div className='text-center'>
                    <p className='text-sm font-medium text-gray-500 mb-2'>
                      Connection Stats
                    </p>
                    <div className='flex space-x-3'>
                      <motion.div
                        className='flex-1 bg-white rounded-lg px-4 py-3 border border-purple-100 shadow-sm hover:shadow-md transition-all cursor-pointer'
                        onClick={handleOpenFollowersModal}
                        title='View followers'
                        whileHover={{ y: -2, scale: 1.02 }}
                      >
                        <div className='font-bold text-xl text-purple-600'>
                          {followersCount}
                        </div>
                        <div className='text-xs font-medium text-gray-500'>
                          Followers
                        </div>
                      </motion.div>

                      <motion.div
                        className='flex-1 bg-white rounded-lg px-4 py-3 border border-purple-100 shadow-sm hover:shadow-md transition-all cursor-pointer'
                        onClick={handleOpenFollowingModal}
                        title='View following'
                        whileHover={{ y: -2, scale: 1.02 }}
                      >
                        <div className='font-bold text-xl text-purple-600'>
                          {followingCount}
                        </div>
                        <div className='text-xs font-medium text-gray-500'>
                          Following
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Edit profile button with better styling */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      gradientDuoTone='purpleToPink'
                      size='sm'
                      onClick={() => navigate('/account-settings')}
                      className='w-full shadow-sm transition-all font-medium'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                        />
                      </svg>
                      Edit Profile
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div variants={itemVariants}>
          <Card className='mb-6'>
            <Tabs
              // Fix: Changed 'style' to the correct prop name
              // If you're using Flowbite React v1.x
              style={{ base: 'underline' }}
              // If you're using Flowbite React v0.x, use this instead:
              // variant="underline"
              onActiveTabChange={tab => setActiveTab(tab)}
            >
              <Tabs.Item
                active={activeTab === 'info'}
                title='Information'
                icon={HiOutlineUserCircle}
              >
                {/* User Information Tab */}
                <div className='py-4'>
                  <h3 className='text-xl font-semibold mb-4'>About Me</h3>

                  <div className='space-y-6'>
                    {/* User Skills */}
                    <div>
                      <h4 className='text-lg font-medium mb-3 flex items-center'>
                        <HiOutlineLightningBolt className='mr-2' />
                        My Skills
                      </h4>

                      {loadingSkills ? (
                        <div className='flex justify-center items-center py-4'>
                          <Spinner size='sm' />
                        </div>
                      ) : skills && skills.length > 0 ? (
                        <div className='space-y-4'>
                          {/* <div className='flex flex-wrap gap-2 mb-4'>
                            {skills.map(skill => (
                              <Badge
                                key={skill.skillId}
                                color='purple'
                                size='lg'
                                className='px-3 py-2 text-sm font-medium'
                              >
                                {skill.skillName}
                              </Badge>
                            ))}
                          </div> */}

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {skills.map(skill => (
                              <div
                                key={skill.skillId}
                                className='bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow'
                              >
                                <div className='flex justify-between items-start'>
                                  <div>
                                    <h3 className='font-bold text-gray-800'>
                                      {skill.skillName}
                                    </h3>
                                    <p className='text-sm text-gray-600 mt-1'>
                                      {skill.description}
                                    </p>
                                  </div>
                                  <Badge color='indigo' className='ml-2'>
                                    {skill.category || 'General'}
                                  </Badge>
                                </div>

                                {/* Proficiency indicator */}
                                {skill.proficiency && (
                                  <div className='mt-3'>
                                    <div className='flex justify-between text-xs font-medium text-gray-600 mb-1'>
                                      <span>Proficiency</span>
                                      <span>{skill.proficiency}/5</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                      <div
                                        className='bg-purple-600 h-2 rounded-full'
                                        style={{
                                          width: `${
                                            (skill.proficiency / 5) * 100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className='text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
                          <HiOutlineLightningBolt className='mx-auto h-8 w-8 text-gray-400' />
                          <p className='mt-2 text-gray-600 font-medium'>
                            No skills added yet
                          </p>
                          <Button
                            color='purple'
                            size='xs'
                            onClick={() => navigate('/preferences')}
                            className='mt-3'
                          >
                            Add Skills
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Account Information */}
                    <div>
                      <h4 className='text-lg font-medium mb-3'>
                        Account Details
                      </h4>
                      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <p className='text-sm text-gray-500'>Status</p>
                            <p className='font-medium'>
                              {user.enabled ? 'Active' : 'Disabled'}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-500'>
                              Account Type
                            </p>
                            <p className='font-medium capitalize'>
                              {user.role?.roleName?.toLowerCase() || 'Standard'}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-500'>Created</p>
                            <p className='font-medium'>
                              {user.createdDate
                                ? new Date(
                                    user.createdDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-500'>
                              Last Updated
                            </p>
                            <p className='font-medium'>
                              {user.updatedDate
                                ? new Date(
                                    user.updatedDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Item>

              <Tabs.Item
                active={activeTab === 'posts'}
                title='Posts'
                icon={HiOutlineDocumentText}
              >
                <div className='py-4'>
                  <PostList
                    userId={userId}
                    showCreateButton={true}
                    onCreateClick={() => setShowCreatePostModal(true)}
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item
                active={activeTab === 'other'}
                title='Other'
                icon={HiOutlineCog}
              >
                {/* Other Tab */}
                <div className='py-4'>
                  <h3 className='text-xl font-semibold mb-4'>
                    Additional Information
                  </h3>

                  <div className='space-y-6'>
                    {/* Preferences */}
                    <div>
                      <h4 className='text-lg font-medium mb-3'>Preferences</h4>
                      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                        <p className='text-gray-600 mb-4'>
                          Customize your experience by updating your
                          preferences.
                        </p>
                        <Button
                          color='light'
                          onClick={() => navigate('/preferences')}
                        >
                          Manage Preferences
                        </Button>
                      </div>
                    </div>

                    {/* Security settings */}
                    <div>
                      <h4 className='text-lg font-medium mb-3'>Security</h4>
                      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                        <p className='text-gray-600 mb-4'>
                          Manage your account security settings and password.
                        </p>
                        <Button
                          color='light'
                          onClick={() => navigate('/profile')}
                        >
                          Security Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFollowersModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <motion.div
              className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFollowersModal(false)}
            />

            <motion.div
              className='bg-white rounded-lg shadow-xl w-full max-w-md z-10 overflow-hidden'
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
            >
              {/* Modal Header */}
              <div className='flex justify-between items-center border-b px-5 py-4'>
                <div className='flex items-center'>
                  <HiOutlineUsers className='text-purple-600 mr-2 h-5 w-5' />
                  <h3 className='text-lg font-medium text-gray-900'>
                    Followers
                  </h3>
                  <span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {followersData.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowFollowersModal(false)}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  <HiOutlineX className='h-5 w-5' />
                </button>
              </div>

              {/* Modal Body */}
              <div className='px-5 py-4 max-h-96 overflow-y-auto'>
                {loadingFollowers ? (
                  <div className='flex justify-center py-8'>
                    <Spinner size='lg' />
                  </div>
                ) : followersData.length > 0 ? (
                  <ul className='divide-y divide-gray-200'>
                    {followersData.map(follower => (
                      <li key={follower.followerId} className='py-3'>
                        <div className='flex items-center space-x-4'>
                          <Avatar
                            size='md'
                            rounded
                            img={
                              follower.userImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                follower.followerUserName
                              )}&background=random`
                            }
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-gray-900 truncate'>
                              {follower.followerUserName}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Following since{' '}
                              {new Date(
                                follower.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size='xs'
                            color='light'
                            onClick={() => {
                              setShowFollowersModal(false);
                              navigate(`/user-wall/${follower.followerUserId}`);
                            }}
                          >
                            <HiOutlineExternalLink className='h-4 w-4' />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className='text-center py-8'>
                    <HiOutlineUsers className='mx-auto h-10 w-10 text-gray-400' />
                    <p className='mt-2 text-gray-600'>No followers yet</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className='bg-gray-50 px-5 py-3 flex justify-end'>
                <Button
                  size='sm'
                  color='gray'
                  onClick={() => setShowFollowersModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Following Modal */}
      <AnimatePresence>
        {showFollowingModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <motion.div
              className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFollowingModal(false)}
            />

            <motion.div
              className='bg-white rounded-lg shadow-xl w-full max-w-md z-10 overflow-hidden'
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
            >
              {/* Modal Header */}
              <div className='flex justify-between items-center border-b px-5 py-4'>
                <div className='flex items-center'>
                  <HiOutlineUsers className='text-purple-600 mr-2 h-5 w-5' />
                  <h3 className='text-lg font-medium text-gray-900'>
                    Following
                  </h3>
                  <span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {followingData.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowFollowingModal(false)}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  <HiOutlineX className='h-5 w-5' />
                </button>
              </div>

              {/* Modal Body */}
              <div className='px-5 py-4 max-h-96 overflow-y-auto'>
                {loadingFollowing ? (
                  <div className='flex justify-center py-8'>
                    <Spinner size='lg' />
                  </div>
                ) : followingData.length > 0 ? (
                  <ul className='divide-y divide-gray-200'>
                    {followingData.map(following => (
                      <li key={following.followerId} className='py-3'>
                        <div className='flex items-center space-x-4'>
                          <Avatar
                            size='md'
                            rounded
                            img={
                              following.userImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                following.followerUserName
                              )}&background=random`
                            }
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-gray-900 truncate'>
                              {following.followerUserName}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Following since{' '}
                              {new Date(
                                following.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size='xs'
                            color='light'
                            onClick={() => {
                              setShowFollowingModal(false);
                              navigate(
                                `/user-wall/${following.followerUserId}`
                              );
                            }}
                          >
                            <HiOutlineExternalLink className='h-4 w-4' />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className='text-center py-8'>
                    <HiOutlineUsers className='mx-auto h-10 w-10 text-gray-400' />
                    <p className='mt-2 text-gray-600'>
                      Not following anyone yet
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className='bg-gray-50 px-5 py-3 flex justify-end'>
                <Button
                  size='sm'
                  color='gray'
                  onClick={() => setShowFollowingModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <CreatePost
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        userId={userId}
        onPostCreated={handlePostCreated}
      />
    </motion.div>
  );
};

export default MyWall;
