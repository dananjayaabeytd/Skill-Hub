import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import {
  HiUserGroup,
  HiDocumentText,
  HiLightningBolt,
  HiClipboardList,
  HiChartPie,
  HiArrowUp,
} from 'react-icons/hi';

const AdminDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  // Helper to render growth indicator
  const renderGrowth = value => {
    return (
      <div className='flex items-center text-green-500'>
        <HiArrowUp className='mr-1' />
        <span>{value}%</span>
      </div>
    );
  };

  // If loading, show a nice loading animation
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center'
        >
          <Spinner size='xl' />
          <p className='mt-4 text-lg font-medium text-gray-700'>
            Loading dashboard data...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='w-full max-w-6xl mx-auto'
      >
        {/* Dashboard Header - Centered with text-center class */}
        <motion.div variants={itemVariants} className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
          <p className='text-gray-500'>
            Overview of your platform's performance and activity
          </p>
        </motion.div>

        {/* Stats Overview Cards - Now centered */}
        <motion.div
          variants={containerVariants}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-center mx-auto'
        >
          {/* Users Card - Now clickable */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='col-span-1 cursor-pointer'
            onClick={() => navigate('/admin-users')}
          >
            <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow'>
              <div className='flex justify-between items-center'>
                <div>
                <p className='text-2xl font-medium text-gray-500 mb-5'>
                Users
                  </p>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Users
                  </p>
                  <div className='mt-1 flex items-center'>
                    <h3 className='text-2xl font-bold text-gray-800'>1,254</h3>
                    <div className='ml-2'>{renderGrowth(12.5)}</div>
                  </div>
                </div>
                <div className='p-3 bg-blue-100 rounded-lg'>
                  <HiUserGroup className='h-6 w-6 text-blue-600' />
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-2'>
                <div className='border-r pr-2'>
                  <p className='text-xs text-gray-500'>Active</p>
                  <p className='font-semibold text-gray-700'>876</p>
                </div>
                <div className='pl-2'>
                  <p className='text-xs text-gray-500'>New This Week</p>
                  <p className='font-semibold text-gray-700'>75</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Posts Card - Now clickable */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='col-span-1 cursor-pointer'
            onClick={() => navigate('/admin-posts')}
          >
            <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow'>
              <div className='flex justify-between items-center'>
                <div>
                <p className='text-2xl font-medium text-gray-500 mb-5'>
                    Posts
                  </p>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Posts
                  </p>
                  <div className='mt-1 flex items-center'>
                    <h3 className='text-2xl font-bold text-gray-800'>432</h3>
                    <div className='ml-2'>{renderGrowth(8.3)}</div>
                  </div>
                </div>
                <div className='p-3 bg-purple-100 rounded-lg'>
                  <HiDocumentText className='h-6 w-6 text-purple-600' />
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-2'>
                <div className='border-r pr-2'>
                  <p className='text-xs text-gray-500'>Published</p>
                  <p className='font-semibold text-gray-700'>389</p>
                </div>
                <div className='pl-2'>
                  <p className='text-xs text-gray-500'>Drafts</p>
                  <p className='font-semibold text-gray-700'>43</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Skills Card - Now clickable */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='col-span-1 cursor-pointer'
            onClick={() => navigate('/admin-skills')}
          >
            <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow'>
              <div className='flex justify-between items-center'>
                <div>
                <p className='text-2xl font-medium text-gray-500 mb-5'>
                Skills
                  </p>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Skills
                  </p>
                  <div className='mt-1 flex items-center'>
                    <h3 className='text-2xl font-bold text-gray-800'>512</h3>
                    <div className='ml-2'>{renderGrowth(15.2)}</div>
                  </div>
                </div>
                <div className='p-3 bg-yellow-100 rounded-lg'>
                  <HiLightningBolt className='h-6 w-6 text-yellow-600' />
                </div>
              </div>

              <div className='mt-4'>
                <p className='text-xs text-gray-500 mb-1'>Popular Skills</p>
                <div className='flex flex-wrap gap-1'>
                  {['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX'].map(
                    (skill, index) => (
                      <span
                        key={index}
                        className='text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full'
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Learning Plans Card - Now clickable */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='col-span-1 cursor-pointer'
            onClick={() => navigate('/admin-learning-plans')}
          >
            <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow'>
              <div className='flex justify-between items-center'>
                <div>
                <p className='text-2xl font-medium text-gray-500 mb-5'>
                Learning Plans
                  </p>
                  <p className='text-sm font-medium text-gray-500'>
                    Learning Plans
                  </p>
                  <div className='mt-1 flex items-center'>
                    <h3 className='text-2xl font-bold text-gray-800'>324</h3>
                    <div className='ml-2'>{renderGrowth(9.7)}</div>
                  </div>
                </div>
                <div className='p-3 bg-green-100 rounded-lg'>
                  <HiClipboardList className='h-6 w-6 text-green-600' />
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-2'>
                <div className='border-r pr-2'>
                  <p className='text-xs text-gray-500'>Active</p>
                  <p className='font-semibold text-gray-700'>187</p>
                </div>
                <div className='pl-2'>
                  <p className='text-xs text-gray-500'>Completed</p>
                  <p className='font-semibold text-gray-700'>137</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Learning Progress Card - Now clickable */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className='col-span-1 cursor-pointer'
            onClick={() => navigate('/admin-learning-progress')}
          >
            <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow'>
              <div className='flex justify-between items-center'>
                <div>
                <p className='text-2xl font-medium text-gray-500 mb-5'>
                Learning Progress
                  </p>
                  <p className='text-sm font-medium text-gray-500'>
                    Learning Progress
                  </p>
                  <div className='mt-1 flex items-center'>
                    <h3 className='text-2xl font-bold text-gray-800'>68%</h3>
                    <div className='ml-2'>{renderGrowth(5.2)}</div>
                  </div>
                </div>
                <div className='p-3 bg-indigo-100 rounded-lg'>
                  <HiChartPie className='h-6 w-6 text-indigo-600' />
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-2'>
                <div className='border-r pr-2'>
                  <p className='text-xs text-gray-500'>Completed</p>
                  <p className='font-semibold text-gray-700'>215</p>
                </div>
                <div className='pl-2'>
                  <p className='text-xs text-gray-500'>Ongoing</p>
                  <p className='font-semibold text-gray-700'>109</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;