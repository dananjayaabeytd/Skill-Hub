import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Card,
  TextInput,
  Label,
  Spinner,
  Button,
  Select,
  ToggleSwitch,
  Avatar,
  Badge,
  ListGroup,
} from 'flowbite-react';
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineLightningBolt,
} from 'react-icons/hi';

import api from '../../services/api';
import Errors from '../../components/Error';
import { useMyContext } from '../../store/ContextApi';

const MyProfile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const [loading, setLoading] = useState(true);
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Get current user from context
  const { currentUser } = useMyContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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

  const handleDeleteSkill = async skillId => {
    if (!currentUser || !currentUser.id) return;

    try {
      await api.delete(
        `/user-skills/users/${currentUser.id}/skills/${skillId}`
      );
      // Update the skills list after successful deletion
      setSkills(skills.filter(skill => skill.skillId !== skillId));
      toast.success('Skill removed successfully');
    } catch (err) {
      console.error('Error removing skill', err);
      toast.error('Failed to remove skill');
    }
  };

  // Fetch user profile from the new API endpoint
  const fetchUserDetails = useCallback(async () => {
    if (!currentUser || !currentUser.id) {
      setLoading(false);
      return;
    }

    try {
      // Updated endpoint based on the UserController
      const response = await api.get(`/users/profile/${currentUser.id}`);
      if (response.data) {
        setUser(response.data);
        setSelectedRole(response.data.role?.roleName || '');
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching user details', err);
      toast.error('Error fetching user profile');
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch user skills from the new API endpoint
  const fetchUserSkills = useCallback(async () => {
    if (!currentUser || !currentUser.id) return;

    setLoadingSkills(true);
    try {
      const response = await api.get(`/users/skills/${currentUser.id}`);
      setSkills(response.data || []);
    } catch (err) {
      console.error('Error fetching user skills', err);
      toast.error('Failed to load skills');
    } finally {
      setLoadingSkills(false);
    }
  }, [currentUser]);

  // Update form values when user data is loaded
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setValue('username', user.userName);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  // Fetch roles for admin functionality
  const fetchRoles = useCallback(async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await api.get('/users/roles');
    } catch (err) {
      console.error('Error fetching roles', err);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchUserDetails();
      fetchRoles();
      fetchUserSkills();
    } else {
      setError('User ID not found. Please log in again.');
      setLoading(false);
    }
  }, [fetchUserDetails, fetchRoles, fetchUserSkills, currentUser]);

  const handleSavePassword = async data => {
    if (!currentUser || !currentUser.id) return;

    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append('userId', currentUser.id);
      formData.append('password', newPassword);

      await api.put(`/admin/update-password`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      setIsEditingPassword(false);
      setValue('password', '');
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(
        'Error updating password: ' +
          (err.response?.data?.message || 'Unknown error')
      );
    } finally {
      setPasswordLoader(false);
    }
  };

  const getUserStatusBadge = () => {
    if (!user) return null;

    if (!user.enabled) {
      return <Badge color='gray'>Disabled</Badge>;
    } else if (!user.accountNonLocked) {
      return <Badge color='failure'>Locked</Badge>;
    } else if (!user.accountNonExpired) {
      return <Badge color='warning'>Expired</Badge>;
    } else {
      return <Badge color='success'>Active</Badge>;
    }
  };

  // If there's no userId, show a message instead of Error component
  if (!currentUser || !currentUser.id) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
          <h2 className='text-2xl font-bold text-center text-red-600 mb-4'>
            Authentication Required
          </h2>
          <p className='text-gray-600 text-center mb-6'>
            Please log in to view your profile information.
          </p>
          <div className='flex justify-center'>
            <Button color='blue' onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Only show the Error component for other types of errors
  if (error && currentUser && currentUser.id) {
    return <Errors message={error} />;
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='p-6 bg-gray-50 min-h-screen'
    >
      {/* Header with back button */}
      <div className='mb-6 mt-'>
        <motion.div variants={itemVariants} className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Profile</h1>
          <p className='text-gray-600'>
            View and manage your account information
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className='flex flex-col justify-center items-center h-64'>
          <Spinner size='xl' color='info' />
          <p className='mt-4 text-gray-600'>Loading your profile...</p>
        </div>
      ) : (
        <div className='max-w-4xl mx-auto'>
          {user && (
            <motion.div variants={itemVariants}>
              <Card className='mb-6'>
                <div className='flex flex-col md:flex-row justify-between items-center'>
                  <div className='flex items-center mb-4 md:mb-0'>
                    <Avatar
                      size='xl'
                      rounded
                      img={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.userName
                      )}&background=random&size=150`}
                      className='ring-offset-2'
                    />
                    <div className='ml-4'>
                      <h3 className='text-2xl font-bold text-gray-800'>
                        {user.userName}
                      </h3>
                      <p className='text-gray-500 flex items-center'>
                        <HiOutlineMail className='mr-1' />
                        {user.email}
                      </p>
                      <div className='flex items-center mt-2 space-x-2'>
                        <Badge
                          color='purple'
                          size='sm'
                          className='capitalize font-medium'
                        >
                          {user.role?.roleName?.toLowerCase() || 'No Role'}
                        </Badge>
                        {getUserStatusBadge()}
                        {user.isTwoFactorEnabled && (
                          <Badge color='indigo' size='sm'>
                            2FA Enabled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-end mt-4 md:mt-0'>
                    <div className='bg-gray-50 rounded-lg px-4 py-2 border border-gray-200'>
                      <div className='text-sm text-gray-500'>Member since</div>
                      <div className='font-medium'>
                        {user.createdDate
                          ? new Date(user.createdDate).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>
                    {user.updatedDate && (
                      <div className='text-xs text-gray-500 mt-2'>
                        Last updated:{' '}
                        {new Date(user.updatedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account status indicators */}
                <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div
                    className={`rounded-lg p-3 flex flex-col items-center ${
                      user.enabled
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div className='font-medium text-sm'>Account</div>
                    <div className='font-bold'>
                      {user.enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-3 flex flex-col items-center ${
                      user.accountNonLocked
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <div className='font-medium text-sm'>Status</div>
                    <div className='font-bold'>
                      {user.accountNonLocked ? 'Unlocked' : 'Locked'}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-3 flex flex-col items-center ${
                      user.accountNonExpired
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    <div className='font-medium text-sm'>Account</div>
                    <div className='font-bold'>
                      {user.accountNonExpired ? 'Active' : 'Expired'}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-3 flex flex-col items-center ${
                      user.credentialsNonExpired
                        ? 'bg-green-50 text-green-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    <div className='font-medium text-sm'>Credentials</div>
                    <div className='font-bold'>
                      {user.credentialsNonExpired ? 'Valid' : 'Expired'}
                    </div>
                  </div>
                </div>

                {/* Show expiry dates if available */}
                {(user.accountExpiryDate || user.credentialsExpiryDate) && (
                  <div className='mt-4 text-sm text-gray-600'>
                    {user.accountExpiryDate && (
                      <div className='flex items-center'>
                        <span className='font-medium mr-2'>
                          Account Expires:
                        </span>
                        {new Date(user.accountExpiryDate).toLocaleDateString()}
                      </div>
                    )}
                    {user.credentialsExpiryDate && (
                      <div className='flex items-center mt-1'>
                        <span className='font-medium mr-2'>
                          Credentials Expire:
                        </span>
                        {new Date(
                          user.credentialsExpiryDate
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
          {/* Profile Information Card */}
          <motion.div variants={itemVariants}>
            <Card className='mb-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                <HiOutlineUserCircle className='mr-2' />
                Profile Information
              </h2>

              <form onSubmit={handleSubmit(handleSavePassword)}>
                <div className='space-y-4'>
                  <div>
                    <div className='mb-2 block'>
                      <Label htmlFor='username' value='Username' />
                    </div>
                    <TextInput
                      id='username'
                      icon={HiOutlineUserCircle}
                      placeholder='Enter username'
                      {...register('username', {
                        required: 'Username is required',
                      })}
                      helperText={errors.username?.message}
                      disabled
                    />
                  </div>

                  <div>
                    <div className='mb-2 block'>
                      <Label htmlFor='email' value='Email' />
                    </div>
                    <TextInput
                      id='email'
                      icon={HiOutlineMail}
                      placeholder='Enter email'
                      {...register('email', { required: 'Email is required' })}
                      helperText={errors.email?.message}
                      disabled
                    />
                  </div>

                  <div>
                    <div className='mb-2 block'>
                      <Label htmlFor='password' value='Password' />
                    </div>
                    <TextInput
                      id='password'
                      type='password'
                      icon={HiOutlineLockClosed}
                      placeholder={
                        isEditingPassword ? 'Enter new password' : '••••••••'
                      }
                      autoFocus={isEditingPassword}
                      {...register('password', {
                        required: isEditingPassword
                          ? 'Password is required'
                          : false,
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      helperText={errors.password?.message}
                      disabled={!isEditingPassword}
                    />
                  </div>

                  <div className='flex space-x-3'>
                    {!isEditingPassword ? (
                      <Button
                        type='button'
                        color='purple'
                        onClick={() => setIsEditingPassword(true)}
                      >
                        <HiOutlinePencil className='mr-2 h-5 w-5' />
                        Change Password
                      </Button>
                    ) : (
                      <>
                        <Button
                          type='submit'
                          color='success'
                          isProcessing={passwordLoader}
                          disabled={passwordLoader}
                        >
                          <HiOutlineCheck className='mr-2 h-5 w-5' />
                          Save
                        </Button>
                        <Button
                          type='button'
                          color='failure'
                          onClick={() => {
                            setIsEditingPassword(false);
                            setValue('password', '');
                          }}
                        >
                          <HiOutlineX className='mr-2 h-5 w-5' />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className='mb-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-gray-800 flex items-center'>
                  <HiOutlineLightningBolt className='mr-2' />
                  My Skills
                </h2>

                {/* Persistent Add Skills button */}
                <Button
                  color='purple'
                  size='xs'
                  onClick={() => navigate('/preferences')}
                  className='flex items-center'
                >
                  <span className='mr-1'>+</span> Add Skills
                </Button>
              </div>

              {loadingSkills ? (
                <div className='flex justify-center items-center py-8'>
                  <Spinner size='md' />
                </div>
              ) : skills && skills.length > 0 ? (
                <div className='space-y-4'>
                  <div className='flex flex-wrap gap-2 mb-4'>
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
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {skills.map(skill => (
                      <div
                        key={skill.skillId}
                        className='bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow relative'
                      >
                        {/* Delete button - visible always with better positioning */}
                        <button
                          onClick={() => handleDeleteSkill(skill.skillId)}
                          className='absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors'
                          title='Remove skill'
                          aria-label='Remove skill'
                        >
                          <HiOutlineTrash className='w-4 h-4' />
                        </button>

                        <div className='flex justify-between items-start pr-8'>
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
                                  width: `${(skill.proficiency / 5) * 100}%`,
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
                <div className='text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
                  <HiOutlineLightningBolt className='mx-auto h-12 w-12 text-gray-400' />
                  <p className='mt-2 text-gray-600 font-medium'>
                    No skills added yet
                  </p>
                  <p className='text-gray-500 text-sm mb-4'>
                    Showcase your expertise by adding skills to your profile
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyProfile;
