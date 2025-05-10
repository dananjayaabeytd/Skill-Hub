import React, { useEffect, useState } from 'react';
import { Button, Card, TextInput, Label } from 'flowbite-react';
import { motion } from 'framer-motion';
import { HiArrowNarrowRight, HiOutlineTrash, HiOutlinePencilAlt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const sliderImages = [
  'https://images.unsplash.com/photo-1589395937658-0557e7d89fad?q=80&w=2012&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1640077596566-d53aa00e99fc?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576004257167-17afad35dde2?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528109901743-12b16e05eedf?q=80&w=2070&auto=format&fit=crop'
];

const testimonials = [
  {
    name: 'Alice Green',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    comment: 'This platform helped me stay on track and achieve my learning goals!',
    rating: 5,
  },
  {
    name: 'Mark Travis',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    comment: 'I love the ability to organize and monitor my learning progress.',
    rating: 4,
  },
  {
    name: 'Sophia Rao',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    comment: 'Clean UI and easy to use. Highly recommended!',
    rating: 5,
  },
];

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/learning-plans');
      setPlans(res.data);
    } catch (err) {
      toast.error('Failed to load plans');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/learning-plans/${id}`);
      setPlans(plans.filter((plan) => plan.id !== id));
      toast.success('Plan deleted');
      navigate('/plans');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredPlans = plans.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="bg-gradient-to-br  via-blue-50 to-white min-h-screen pt-8 pb-20 px-4 md:px-8 lg:px-16">
      <motion.div
        initial='hidden'
        animate='visible'
        variants={staggerContainer}
        className='max-w-6xl mx-auto'
      >
        <motion.div variants={fadeIn} className='mb-10 text-center'>
          <h2 className='text-4xl font-extrabold text-blue-900 mb-3'>My Learning Plans</h2>
          <p className='text-gray-700'>Track, manage, and grow your personalized learning journey.</p>
        </motion.div>

        <motion.div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10' variants={fadeIn}>
          <div>
            <p className='text-gray-700 mb-4'>
              Learning plans help organize, manage, and track your progress by breaking down larger goals into manageable tasks. This structure keeps you focused, motivated, and ensures consistent progress toward your learning objectives.
            </p>
            <ul className='list-disc pl-5 text-gray-700 space-y-2 mb-6'>
              <li>Organize learning efficiently</li>
              <li>Track progress over time</li>
              <li>Stay motivated with structured goals</li>
              <li>Custom-tailored paths for growth</li>
            </ul>
            <Button gradientDuoTone='purpleToBlue' size='lg' onClick={() => navigate('/plans/create')}>
              Create New Plan <HiArrowNarrowRight className='ml-2 h-5 w-5' />
            </Button>
          </div>
          <motion.div className='overflow-hidden rounded-lg shadow-md h-72'>
            <img
              src={sliderImages[currentImageIndex]}
              alt='Learning visual'
              className='w-full h-full object-cover transition-all duration-1000 ease-in-out'
            />
          </motion.div>
        </motion.div>

        <motion.div className="mb-6 max-w-md">
          <Label htmlFor="search" value="Search Your Plans" />
          <TextInput
            id="search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </motion.div>

        <motion.div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-16' variants={staggerContainer}>
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeIn}
              onClick={() => navigate(`/plans/view/${plan.id}`)}
              className='cursor-pointer'
            >
              <Card className="relative hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
                <Button
                  size="xs"
                  className="absolute top-2 right-2 z-20"
                  gradientDuoTone="purpleToBlue"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/progress/start/${plan.id}/select-template`);
                  }}
                >
                  + Progress
                </Button>

                <div>
                  <h5 className="text-xl font-semibold text-gray-800">{plan.title}</h5>
                  <p className="text-gray-600 mb-3">{plan.description}</p>
                </div>

                <div className="mt-auto flex gap-2 z-10">
                  <Button
                    color="gray"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/plans/edit/${plan.id}`);
                    }}
                  >
                    <HiOutlinePencilAlt className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    color="failure"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(plan.id);
                    }}
                  >
                    <HiOutlineTrash className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className='mt-12' variants={fadeIn}>
          <h3 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>What Our Users Say</h3>
          <div className='grid md:grid-cols-3 gap-6'>
            {testimonials.map((user, idx) => (
              <motion.div
                key={idx}
                className='bg-white rounded-xl shadow p-5 text-center border border-gray-100 hover:shadow-md transition'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className='w-16 h-16 rounded-full mx-auto mb-4 object-cover'
                />
                <h5 className='font-semibold text-lg'>{user.name}</h5>
                <p className='text-sm text-gray-500 mt-2'>{user.comment}</p>
                <p className='text-yellow-500 mt-2'>{'★'.repeat(user.rating)}{'☆'.repeat(5 - user.rating)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LearningPlans;
