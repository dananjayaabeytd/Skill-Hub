import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Spinner, Tooltip } from 'flowbite-react';
import {
  HiCheck,
  HiOutlineSearch,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../../store/ContextApi';

const Preferences = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useMyContext();

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await api.get('/skills');
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Filter skills based on search term
  const filteredSkills = skills.filter(
    skill =>
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description &&
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle skill selection
  const toggleSkill = skillId => {
    setSelectedSkills(prevSelectedSkills => {
      if (prevSelectedSkills.includes(skillId)) {
        return prevSelectedSkills.filter(id => id !== skillId);
      } else {
        return [...prevSelectedSkills, skillId];
      }
    });
  };

  // Save user preferences and continue
  const savePreferences = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    if (!currentUser || !currentUser.id) {
      toast.error(
        'User information not available. Please try logging in again.'
      );
      navigate('/login');
      return;
    }

    try {
      setIsSaving(true);

      // Send selected skills to the new endpoint
      await api.post(
        `/user-skills/users/${currentUser.id}/batch`,
        selectedSkills
      );

      toast.success('Preferences saved successfully!');

      // Redirect to home page or dashboard after saving preferences
      setTimeout(() => {
        navigate('/account-settings');
        window.scrollTo(0, 0);
      }, 500);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const skipPreferences = () => {
    toast('You can always update your preferences later', {
      icon: '👍',
    });
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <motion.div
        className='max-w-6xl mx-auto px-4 py-12'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        <motion.div className='text-center mb-10' variants={itemVariants}>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Welcome to <span className='text-blue-600'>Skill Hub</span>
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Tell us about your interests so we can personalize your experience
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className='mb-8'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <HiOutlineSearch className='w-5 h-5 text-gray-500' />
            </div>
            <input
              type='search'
              id='search'
              className='block w-full p-4 pl-10 text-lg border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500'
              placeholder='Search for skills...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Spinner size='xl' color='purple' />
          </div>
        ) : (
          <>
            <motion.div
              variants={itemVariants}
              className='mb-4 flex flex-wrap items-center gap-2'
            >
              <span className='font-medium text-gray-700'>Selected:</span>
              {selectedSkills.length === 0 ? (
                <span className='text-gray-500 italic'>No skills selected</span>
              ) : (
                skills
                  .filter(skill => selectedSkills.includes(skill.skillId))
                  .map(skill => (
                    <Badge
                      key={skill.skillId}
                      color='info'
                      className='cursor-pointer'
                      onClick={() => toggleSkill(skill.skillId)}
                    >
                      {skill.skillName} ✕
                    </Badge>
                  ))
              )}
            </motion.div>

            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              variants={containerVariants}
            >
              {filteredSkills.length > 0 ? (
                filteredSkills.map(skill => (
                  <motion.div
                    key={skill.skillId}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Card
                      className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                        selectedSkills.includes(skill.skillId)
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : ''
                      }`}
                      onClick={() => toggleSkill(skill.skillId)}
                    >
                      <div className='flex items-start justify-between'>
                        <div>
                          <h5 className='text-xl font-bold tracking-tight text-gray-900 mb-2'>
                            {skill.skillName}
                          </h5>
                          <p className='font-normal text-gray-700 line-clamp-3'>
                            {skill.description ||
                              'Explore this skill to enhance your professional portfolio.'}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            selectedSkills.includes(skill.skillId)
                              ? 'bg-blue-600'
                              : 'border-2 border-gray-300'
                          }`}
                        >
                          {selectedSkills.includes(skill.skillId) && (
                            <HiCheck className='text-white' />
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className='col-span-full text-center py-10'
                  variants={itemVariants}
                >
                  <p className='text-gray-600 text-lg'>
                    No matching skills found. Try a different search term.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}

        <motion.div
          className='mt-12 flex flex-col sm:flex-row items-center justify-center gap-4'
          variants={itemVariants}
        >
          <Button
            gradientDuoTone='purpleToPink'
            size='lg'
            onClick={savePreferences}
            disabled={isSaving}
            className='w-full sm:w-auto'
          >
            {isSaving ? (
              <>
                <Spinner size='sm' className='mr-3' />
                Saving...
              </>
            ) : (
              <>
                Continue
                <HiOutlineChevronRight className='ml-2 h-5 w-5' />
              </>
            )}
          </Button>

          <Tooltip content='You can set your preferences later'>
            <Button
              color='light'
              size='lg'
              onClick={skipPreferences}
              className='w-full sm:w-auto'
            >
              Skip for now
            </Button>
          </Tooltip>
        </motion.div>

        <motion.p
          className='text-center text-gray-600 mt-6'
          variants={itemVariants}
        >
          You can always update your preferences later from your profile
          settings.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Preferences;
