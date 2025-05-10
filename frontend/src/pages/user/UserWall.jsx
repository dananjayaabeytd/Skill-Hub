import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  HiOutlineChartBar,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
} from 'react-icons/hi';

import api from '../../services/api';
import Errors from '../../components/Error';
import { useMyContext } from '../../store/ContextApi';
import CreatePost from '../posts/CreatePost';
import PostList from '../posts/PostList';
import ProgressCard from "../progress/ProgressCard";

const UserWall = () => {
  const { currentUser } = useMyContext();
  const { userId } = useParams();
  const currentUserId = currentUser?.id;

  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState(null);

  // New state for follow functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [entries, setEntries] = useState([])

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

  // Check if current user is following the profile user
  const checkFollowStatus = useCallback(async () => {
    // Only check follow status if viewing someone else's profile
    if (!currentUserId || !userId || currentUserId === parseInt(userId)) {
      return;
    }

    try {
      const response = await api.get(`/followers/check`, {
        params: {
          userId: userId,
          followerUserId: currentUserId
        }
      });
      setIsFollowing(response.data);
    } catch (err) {
      console.error('Error checking follow status', err);
      setIsFollowing(false);
    }
  }, [currentUserId, userId]);

  // Follow user function
  const handleFollowUser = async () => {
    if (!currentUserId || !userId) {
      toast.error('You need to be logged in to follow users');
      return;
    }

    setFollowLoading(true);
    try {
      await api.post('/followers/follow', null, {
        params: {
          userId: userId,
          followerUserId: currentUserId
        }
      });

      setIsFollowing(true);
      // Update followers count
      setFollowersCount(prev => prev + 1);
      toast.success(`You are now following ${user.userName}`);
    } catch (err) {
      console.error('Error following user', err);
      toast.error('Failed to follow user');
    } finally {
      setFollowLoading(false);
    }
  };

  // Unfollow user function
  const handleUnfollowUser = async () => {
    if (!currentUserId || !userId) {
      return;
    }

    setFollowLoading(true);
    try {
      await api.delete('/followers/unfollow', {
        params: {
          userId: userId,
          followerUserId: currentUserId
        }
      });

      setIsFollowing(false);
      // Update followers count
      setFollowersCount(prev => Math.max(prev - 1, 0));
      toast.success(`You have unfollowed ${user.userName}`);
    } catch (err) {
      console.error('Error unfollowing user', err);
      toast.error('Failed to unfollow user');
    } finally {
      setFollowLoading(false);
    }
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

  // Fetch progress entries for logged-in user
  const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/me');
        setEntries(res.data || []);
      } catch (err) {
        console.error('Failed to fetch user progress');
      }
  };

  const grouped = entries.reduce((acc, entry) => {
      if (!acc[entry.planId]) acc[entry.planId] = [];
      acc[entry.planId].push(entry);
      return acc;
  }, {});


  // Get user status badge
  const getUserStatusBadge = () => {
    if (!user) return null;

    if (user.enabled && user.accountNonLocked && user.accountNonExpired) {
      return <Badge color='success'>Active</Badge>;
    } else {
      return <Badge color='gray'>Inactive</Badge>;
    }
  };
  // With this corrected code:
useEffect(() => {
  fetchUserDetails();
  fetchUserSkills();
  fetchSocialStats();
  fetchProgress();
  checkFollowStatus();
}, [fetchUserDetails, fetchUserSkills, fetchSocialStats, checkFollowStatus]);

  // // Initialize data on component mount
  // useEffect(() => {
  //   fetchUserDetails();
  //   fetchUserSkills();
  //   fetchSocialStats();
  //   fetchProgress();
  // }, [fetchUserDetails, fetchUserSkills, fetchSocialStats]);
  //   checkFollowStatus();
  // }, [fetchUserDetails, fetchUserSkills, fetchSocialStats, checkFollowStatus]);

  // Render follow/unfollow button based on conditions
  const renderFollowButton = () => {
    // Don't show follow button on your own profile
    if (!currentUserId || currentUserId === parseInt(userId)) {
      return (
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
            Edit Profile
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          gradientDuoTone={isFollowing ? 'cyanToBlue' : 'purpleToPink'}
          size='sm'
          onClick={isFollowing ? handleUnfollowUser : handleFollowUser}
          className='w-full shadow-sm transition-all font-medium'
          disabled={followLoading}
        >
          {followLoading ? (
            <div className="flex items-center justify-center">
              <Spinner size="sm" className="mr-2" />
              <span>Processing</span>
            </div>
          ) : isFollowing ? (
            <div className="flex items-center">
              <HiOutlineUserRemove className="mr-2" />
              <span>Unfollow</span>
            </div>
          ) : (
            <div className="flex items-center">
              <HiOutlineUserAdd className="mr-2" />
              <span>Follow</span>
            </div>
          )}
        </Button>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center h-64'>
        <Spinner size='xl' color='info' />
        <p className='mt-4 text-gray-600'>Loading profile...</p>
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
        <p className='text-gray-600 mt-2'>Please log in to view this profile.</p>
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

  // Is this the current user's own profile?
  const isOwnProfile = currentUserId === parseInt(userId);

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
                  <div className='flex flex-wrap items-center'>
                    <h1 className='text-2xl font-extrabold text-gray-800 mr-2'>
                      {user.userName}
                    </h1>
                    {isOwnProfile && (
                      <span className='text-sm text-white bg-purple-500 py-0.5 px-3 rounded-full font-medium'>
                        You
                      </span>
                    )}
                  </div>

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

                  {/* Follow/Unfollow or Edit Profile button */}
                  {renderFollowButton()}
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
                          {isOwnProfile && (
                            <Button
                              color='purple'
                              size='xs'
                              onClick={() => navigate('/preferences')}
                              className='mt-3'
                            >
                              Add Skills
                            </Button>
                          )}
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
                    showCreateButton={isOwnProfile}
                    publicOnly={true}
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
                        {isOwnProfile && (
                          <Button
                            color='light'
                            onClick={() => navigate('/preferences')}
                          >
                            Manage Preferences
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Security settings */}
                    <div>
                      <h4 className='text-lg font-medium mb-3'>Security</h4>
                      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                        <p className='text-gray-600 mb-4'>
                          Manage your account security settings and password.
                        </p>
                        {isOwnProfile && (
                          <Button
                            color='light'
                            onClick={() => navigate('/profile')}
                          >
                            Security Settings
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Item>
              <Tabs.Item
                active={activeTab === 'progress'}
                title='Progress Entry'
                icon={HiOutlineChartBar}
              >
                <div className="py-4">
                  <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
                    <h3 className="text-xl font-semibold">My Progress Entries</h3>
                  </div>

                  {entries.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-600 font-medium">You haven’t posted any progress yet</p>
                      <p className="text-sm text-gray-500 mb-4">Share your milestones and learning progress with the community</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(grouped).map(([planId, items]) => (
                        <div
                          key={planId}
                          className="bg-gray-50 border border-gray-200 p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-semibold text-gray-700">
                              Plan #{planId}
                            </h4>
                            <span
                              className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
                              onClick={() => navigate(`/progress/plan/${planId}`)}
                            >
                              Track my progress on this plan →
                            </span>
                          </div>
                          <div className="grid gap-4">
                            {items.map((entry) => (
                              <ProgressCard
                                key={entry.id}
                                entry={entry}
                                user={user}
                                isOwner={true}
                                onEdit={() => navigate(`/progress/edit/${entry.id}`)}
                                onDelete={async () => {
                                  try {
                                    await api.delete(`/progress/${entry.id}`);
                                    toast.success('Entry deleted');
                                    fetchProgress();
                                  } catch (err) {
                                    toast.error('Failed to delete entry');
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                              navigate(`/user-wall/${following.followerUserId}`);
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

export default UserWall;