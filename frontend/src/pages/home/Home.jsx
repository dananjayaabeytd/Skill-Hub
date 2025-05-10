import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Carousel, Avatar } from 'flowbite-react';
import {
  HiArrowNarrowRight,
  HiAcademicCap,
  HiUserGroup,
  HiLightBulb,
} from 'react-icons/hi';

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className='bg-gradient-to-b from-white to-blue-50'>
      {/* Hero Section */}
      <motion.section
        className='flex flex-col lg:flex-row items-center justify-between py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto'
        initial='hidden'
        animate='visible'
        variants={staggerContainer}
      >
        <motion.div className='lg:w-1/2 mb-10 lg:mb-0' variants={fadeIn}>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6'>
            Discover Your <span className='text-blue-600'>Potential</span>
          </h1>
          <p className='text-lg text-gray-600 mb-8'>
            Connect with experts, learn new skills, and advance your career with
            our cutting-edge skill development platform.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button gradientDuoTone='purpleToBlue' size='xl'>
              Get Started
              <HiArrowNarrowRight className='ml-2 h-5 w-5' />
            </Button>
            <Button color='light' size='xl'>
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div className='lg:w-1/2' variants={fadeIn}>
          <Carousel
            slideInterval={5000}
            className='rounded-lg shadow-xl overflow-hidden'
          >
            <img
              src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE3MTE1MzQyNDQ&ixlib=rb-4.0.3&q=80&w=1080'
              alt='Tech learning'
              className='h-80 object-cover w-full'
            />
            <img
              src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVhbXdvcmt8fHx8fHwxNzExNTM0Mjg2&ixlib=rb-4.0.3&q=80&w=1080'
              alt='Teamwork'
              className='h-80 object-cover w-full'
            />
            <img
              src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyZWVyfHx8fHx8MTcxMTUzNDMwNw&ixlib=rb-4.0.3&q=80&w=1080'
              alt='Career growth'
              className='h-80 object-cover w-full'
            />
          </Carousel>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className='py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div className='text-center mb-12' variants={fadeIn}>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Why Choose Skill Hub?
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Our platform offers unique features designed to help you grow
            professionally and connect with like-minded individuals.
          </p>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Card className='h-full hover:shadow-xl transition-shadow duration-300'>
              <div className='flex justify-center mb-4'>
                <div className='p-4 bg-blue-100 rounded-full'>
                  <HiAcademicCap className='h-8 w-8 text-blue-600' />
                </div>
              </div>
              <h3 className='text-xl font-semibold text-center mb-2'>
                Expert-Led Courses
              </h3>
              <p className='text-gray-600 text-center'>
                Learn from industry professionals with courses designed to build
                practical, job-ready skills.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className='h-full hover:shadow-xl transition-shadow duration-300'>
              <div className='flex justify-center mb-4'>
                <div className='p-4 bg-green-100 rounded-full'>
                  <HiUserGroup className='h-8 w-8 text-green-600' />
                </div>
              </div>
              <h3 className='text-xl font-semibold text-center mb-2'>
                Community Support
              </h3>
              <p className='text-gray-600 text-center'>
                Join a thriving community of learners and professionals to
                network and collaborate.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className='h-full hover:shadow-xl transition-shadow duration-300'>
              <div className='flex justify-center mb-4'>
                <div className='p-4 bg-purple-100 rounded-full'>
                  <HiLightBulb className='h-8 w-8 text-purple-600' />
                </div>
              </div>
              <h3 className='text-xl font-semibold text-center mb-2'>
                Personalized Growth
              </h3>
              <p className='text-gray-600 text-center'>
                Get customized learning paths and recommendations based on your
                goals and interests.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className='bg-blue-600 py-16 px-4 md:px-8 lg:px-16'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div
          className='max-w-7xl mx-auto text-center mb-12'
          variants={fadeIn}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            What Our Users Say
          </h2>
          <p className='text-lg text-blue-100 max-w-3xl mx-auto'>
            Discover how Skill Hub has helped thousands of professionals advance
            their careers.
          </p>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
          variants={staggerContainer}
        >
          {[
            {
              name: 'Sarah Johnson',
              role: 'UX Designer',
              text: 'Skill Hub completely transformed my career. I learned new design techniques that helped me land my dream job!',
              avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
            },
            {
              name: 'Michael Chen',
              role: 'Software Developer',
              text: 'The coding courses are incredible. I gained practical skills that I use every day in my development work.',
              avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            },
            {
              name: 'Priya Patel',
              role: 'Marketing Specialist',
              text: "The community here is amazing! I've made valuable connections and found mentors who have guided my career growth.",
              avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
            },
          ].map((testimonial, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className='bg-white h-full'>
                <div className='flex flex-col items-center'>
                  <Avatar
                    img={testimonial.avatar}
                    rounded
                    size='lg'
                    className='mb-3 border-4 border-blue-100'
                  />
                  <h5 className='text-lg font-medium'>{testimonial.name}</h5>
                  <p className='text-sm text-gray-500 mb-4'>
                    {testimonial.role}
                  </p>
                  <p className='text-gray-600 text-center italic'>
                    "{testimonial.text}"
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className='py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto text-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
          Ready to Start Your Learning Journey?
        </h2>
        <p className='text-lg text-gray-600 mb-8 max-w-3xl mx-auto'>
          Join thousands of professionals who are already enhancing their skills
          and advancing their careers with Skill Hub.
        </p>
        <div className='flex justify-center'>
          <Button
            gradientDuoTone='purpleToBlue'
            size='xl'
            className='animate-pulse'
          >
            Join Skill Hub Today
            <HiArrowNarrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
