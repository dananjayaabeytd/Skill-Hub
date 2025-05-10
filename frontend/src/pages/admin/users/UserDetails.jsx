import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Badge
} from 'flowbite-react';
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineKey,
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineShieldCheck
} from 'react-icons/hi';

import api from '../../../services/api';
import Errors from '../../../components/Error';

const UserDetails = () => {
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

  const [loading, setLoading] = useState(false);
  const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);
      setSelectedRole(response.data.role?.roleName || '');
    } catch (err) {
      setError(err?.response?.data?.message || 'Error fetching user details');
      toast.error('Error fetching user details');
      console.error('Error fetching user details', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setValue('username', user.userName);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get('/admin/roles');
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error fetching roles');
      console.error('Error fetching roles', err);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  const handleRoleChange = e => {
    setSelectedRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    setUpdateRoleLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append('userId', userId);
      formData.append('roleName', selectedRole);

      await api.put(`/admin/update-role`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      fetchUserDetails();
      toast.success('Role updated successfully');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update role');
    } finally {
      setUpdateRoleLoader(false);
    }
  };

  const handleSavePassword = async data => {
    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append('userId', userId);
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
      toast.error('Error updating password: ' + (err.response?.data || 'Unknown error'));
    } finally {
      setPasswordLoader(false);
    }
  };

  const handleAccountToggle = async (name, checked, updateUrl) => {
    let message = '';
    
    switch(name) {
      case 'lock': 
        message = 'Account lock status updated'; 
        break;
      case 'expire': 
        message = 'Account expiry status updated'; 
        break;
      case 'enabled': 
        message = 'Account enabled status updated'; 
        break;
      case 'credentialsExpire': 
        message = 'Credentials expiry status updated'; 
        break;
      default: 
        message = 'Account status updated';
    }

    try {
      const formData = new URLSearchParams();
      formData.append('userId', userId);
      formData.append(name, checked);

      await api.put(updateUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      fetchUserDetails();
      toast.success(message);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error updating account status');
      console.error(`Error updating ${name}:`, err);
    }
  };

  const getUserStatusBadge = () => {
    if (!user) return null;
    
    if (!user.enabled) {
      return <Badge color="gray">Disabled</Badge>;
    } else if (!user.accountNonLocked) {
      return <Badge color="failure">Locked</Badge>;
    } else if (!user.accountNonExpired) {
      return <Badge color="warning">Expired</Badge>;
    } else {
      return <Badge color="success">Active</Badge>;
    }
  };

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gray-50 min-h-screen"
    >
      {/* Header with back button */}
      <div className="mb-6">
        <Button 
          color="light" 
          size="sm" 
          onClick={() => navigate('/admin-users')}
          className="mb-4"
        >
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Back to Users
        </Button>
        
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Details</h1>
          <p className="text-gray-600">Manage user information and permissions</p>
        </motion.div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Spinner size="xl" color="info" />
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* User Summary Card */}
          {user && (
            <motion.div variants={itemVariants}>
              <Card className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Avatar 
                      size="lg" 
                      rounded
                      img={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=random`}
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-800">{user.userName}</h3>
                      <p className="text-gray-500 flex items-center">
                        <HiOutlineMail className="mr-1" />
                        {user.email}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge color="purple" className="mr-2">
                          {user.role?.roleName || 'No Role'}
                        </Badge>
                        {getUserStatusBadge()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID: {userId}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* Profile Information Card */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <HiOutlineUserCircle className="mr-2" />
                Profile Information
              </h2>
              
              <form onSubmit={handleSubmit(handleSavePassword)}>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="username" value="Username" />
                    </div>
                    <TextInput
                      id="username"
                      icon={HiOutlineUserCircle}
                      placeholder="Enter username"
                      {...register('username', { required: 'Username is required' })}
                      helperText={errors.username?.message}
                      disabled
                    />
                  </div>
                  
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput
                      id="email"
                      icon={HiOutlineMail}
                      placeholder="Enter email"
                      {...register('email', { required: 'Email is required' })}
                      helperText={errors.email?.message}
                      disabled
                    />
                  </div>
                  
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="password" value="Password" />
                    </div>
                    <TextInput
                      id="password"
                      type="password"
                      icon={HiOutlineLockClosed}
                      placeholder={isEditingPassword ? "Enter new password" : "••••••••"}
                      autoFocus={isEditingPassword}
                      {...register('password', {
                        required: isEditingPassword ? 'Password is required' : false,
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      helperText={errors.password?.message}
                      disabled={!isEditingPassword}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    {!isEditingPassword ? (
                      <Button 
                        type="button" 
                        color="purple"
                        onClick={() => setIsEditingPassword(true)}
                      >
                        <HiOutlinePencil className="mr-2 h-5 w-5" />
                        Change Password
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="submit" 
                          color="success"
                          isProcessing={passwordLoader}
                          disabled={passwordLoader}
                        >
                          <HiOutlineCheck className="mr-2 h-5 w-5" />
                          Save
                        </Button>
                        <Button 
                          type="button" 
                          color="failure"
                          onClick={() => {
                            setIsEditingPassword(false);
                            setValue('password', '');
                          }}
                        >
                          <HiOutlineX className="mr-2 h-5 w-5" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
          
          {/* Admin Actions Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <HiOutlineShieldCheck className="mr-2" />
                Admin Actions
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Role Management</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-auto">
                    <Select
                      id="role"
                      value={selectedRole}
                      onChange={handleRoleChange}
                      className="uppercase"
                    >
                      {roles.map(role => (
                        <option 
                          key={role.roleId} 
                          value={role.roleName}
                          className="uppercase"
                        >
                          {role.roleName}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button 
                    color="blue" 
                    onClick={handleUpdateRole}
                    isProcessing={updateRoleLoader}
                    disabled={updateRoleLoader}
                  >
                    <HiOutlineKey className="mr-2 h-5 w-5" />
                    Update Role
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HiOutlineLockClosed className="mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Lock Account</span>
                    </div>
                    <ToggleSwitch
                      checked={!user?.accountNonLocked}
                      onChange={(checked) => handleAccountToggle('lock', checked, '/admin/update-lock-status')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HiOutlineExclamation className="mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Account Expired</span>
                    </div>
                    <ToggleSwitch
                      checked={!user?.accountNonExpired}
                      onChange={(checked) => handleAccountToggle('expire', checked, '/admin/update-expiry-status')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HiOutlineCheck className="mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Account Enabled</span>
                    </div>
                    <ToggleSwitch
                      checked={user?.enabled}
                      onChange={(checked) => handleAccountToggle('enabled', checked, '/admin/update-enabled-status')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HiOutlineKey className="mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Credentials Expired</span>
                    </div>
                    <ToggleSwitch
                      checked={!user?.credentialsNonExpired}
                      onChange={(checked) => {
                        const updateUrl = `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`;
                        handleAccountToggle('credentialsExpire', checked, updateUrl);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserDetails;