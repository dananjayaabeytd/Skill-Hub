import React from 'react';
import { motion } from 'framer-motion';
import { Button, Timeline, Avatar, Card, Accordion } from 'flowbite-react';
import {
  HiOutlineGlobe,
  HiOutlineUsers,
  HiOutlineLightBulb,
  HiArrowNarrowRight,
  HiCalendar,
  HiAcademicCap,
} from 'react-icons/hi';

const AboutUs = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className='bg-gradient-to-b from-white to-blue-50'>
      {/* Hero Section */}
      <motion.section
        className='py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto text-center'
        initial='hidden'
        animate='visible'
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn}>
          <h1 className='mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900'>
            Our{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
              Mission
            </span>{' '}
            & Story
          </h1>
          <p className='mb-8 text-lg md:text-xl font-normal text-gray-600 lg:text-2xl max-w-4xl mx-auto'>
            Empowering individuals with the skills and knowledge to thrive in an
            ever-evolving digital world
          </p>
        </motion.div>

        <motion.div
          className='flex flex-wrap justify-center gap-4'
          variants={fadeIn}
        >
          <Button gradientDuoTone='purpleToBlue' size='xl'>
            Join Our Team
          </Button>
          <Button color='light' size='xl'>
            Our Vision
            <HiArrowNarrowRight className='ml-2 h-5 w-5' />
          </Button>
        </motion.div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        className='py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className='flex flex-col lg:flex-row gap-12 items-center'>
          <motion.div className='lg:w-1/2' variants={fadeIn}>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              Our Journey
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
              Skill Hub began in 2018 with a simple yet powerful vision: to
              democratize education and make high-quality learning accessible to
              everyone, regardless of their background or location.
            </p>
            <p className='text-lg text-gray-600 mb-6'>
              What started as a small team passionate about education has grown
              into a thriving community of learners, educators, and industry
              experts united by the belief that knowledge should be accessible
              to all.
            </p>
            <p className='text-lg text-gray-600'>
              Today, we've helped over 500,000 learners worldwide develop new
              skills, advance their careers, and achieve their professional
              goals. But our journey is just beginning.
            </p>
          </motion.div>

          <motion.div className='lg:w-1/2' variants={scaleIn}>
            <div className='rounded-lg overflow-hidden shadow-xl bg-white p-4 md:p-6'>
              <Timeline>
                <Timeline.Item>
                  <Timeline.Point icon={HiCalendar} className='text-blue-600' />
                  <Timeline.Content>
                    <Timeline.Time className='text-sm font-medium text-blue-600'>
                      2018
                    </Timeline.Time>
                    <Timeline.Title className='text-lg font-bold text-gray-800'>
                      Skill Hub Founded
                    </Timeline.Title>
                    <Timeline.Body className='text-gray-600'>
                      Started with just 5 courses and a dream to revolutionize
                      online education
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>

                <Timeline.Item>
                  <Timeline.Point
                    icon={HiOutlineUsers}
                    className='text-green-600'
                  />
                  <Timeline.Content>
                    <Timeline.Time className='text-sm font-medium text-green-600'>
                      2020
                    </Timeline.Time>
                    <Timeline.Title className='text-lg font-bold text-gray-800'>
                      Community Growth
                    </Timeline.Title>
                    <Timeline.Body className='text-gray-600'>
                      Reached 100,000 users and expanded our course offerings to
                      over 200 specialized tracks
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>

                <Timeline.Item>
                  <Timeline.Point
                    icon={HiOutlineGlobe}
                    className='text-purple-600'
                  />
                  <Timeline.Content>
                    <Timeline.Time className='text-sm font-medium text-purple-600'>
                      2022
                    </Timeline.Time>
                    <Timeline.Title className='text-lg font-bold text-gray-800'>
                      Global Expansion
                    </Timeline.Title>
                    <Timeline.Body className='text-gray-600'>
                      Launched in 15 new countries and added support for 8
                      languages
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>

                <Timeline.Item>
                  <Timeline.Point
                    icon={HiAcademicCap}
                    className='text-indigo-600'
                  />
                  <Timeline.Content>
                    <Timeline.Time className='text-sm font-medium text-indigo-600'>
                      2024
                    </Timeline.Time>
                    <Timeline.Title className='text-lg font-bold text-gray-800'>
                      Innovation in Learning
                    </Timeline.Title>
                    <Timeline.Body className='text-gray-600'>
                      Introduced AI-powered personalized learning paths and
                      interactive workshops
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
              </Timeline>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className='py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-blue-500 to-purple-600'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div variants={fadeIn} className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
              Our Core Values
            </h2>
            <p className='text-lg text-blue-100 max-w-3xl mx-auto'>
              These principles guide everything we do at Skill Hub, from course
              development to community engagement.
            </p>
          </motion.div>

          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className='h-full hover:shadow-2xl transition-shadow duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 bg-blue-100 rounded-lg'>
                    <HiOutlineGlobe className='h-7 w-7 text-blue-700' />
                  </div>
                  <h3 className='text-xl font-bold'>Accessibility</h3>
                </div>
                <p className='text-gray-600'>
                  We believe quality education should be accessible to everyone,
                  regardless of geographic or economic barriers.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className='h-full hover:shadow-2xl transition-shadow duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 bg-green-100 rounded-lg'>
                    <HiOutlineUsers className='h-7 w-7 text-green-700' />
                  </div>
                  <h3 className='text-xl font-bold'>Community</h3>
                </div>
                <p className='text-gray-600'>
                  Learning thrives in supportive communities where knowledge is
                  shared and connections are fostered.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className='h-full hover:shadow-2xl transition-shadow duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 bg-purple-100 rounded-lg'>
                    <HiOutlineLightBulb className='h-7 w-7 text-purple-700' />
                  </div>
                  <h3 className='text-xl font-bold'>Innovation</h3>
                </div>
                <p className='text-gray-600'>
                  We continuously innovate our platform and courses to reflect
                  the latest industry trends and teaching methodologies.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className='py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
            Meet Our Leadership Team
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Passionate educators, industry experts, and innovators dedicated to
            transforming online learning.
          </p>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
          variants={staggerContainer}
        >
          {[
            {
              name: 'Alexandra Wang',
              role: 'Founder & CEO',
              image:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE1MzQwNzIw&ixlib=rb-1.2.1&q=80&w=300',
              bio: 'Former education technology leader with a passion for accessible learning',
            },
            {
              name: 'Marcus Johnson',
              role: 'CTO',
              image:
                'https://images.unsplash.com/photo-1566492031773-4f4e44671857?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE1MzQwNzIw&ixlib=rb-1.2.1&q=80&w=300',
              bio: 'Software engineer and AI specialist focused on creating intuitive learning experiences',
            },
            {
              name: 'Sarah Patel',
              role: 'Head of Content',
              image:
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE1MzQwNzIw&ixlib=rb-1.2.1&q=80&w=300',
              bio: 'Curriculum developer with 15+ years experience in educational publishing',
            },
            {
              name: 'David Rodriguez',
              role: 'Community Director',
              image:
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE1MzQwNzIw&ixlib=rb-1.2.1&q=80&w=300',
              bio: 'Community builder focused on creating supportive learning environments',
            },
          ].map((member, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className='text-center hover:shadow-xl transition-shadow duration-300'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className='flex justify-center'
                >
                  <Avatar
                    img={member.image}
                    size='xl'
                    rounded
                    className='mb-4 border-4 border-blue-100 ring-4 ring-blue-50'
                  />
                </motion.div>
                <h3 className='text-xl font-bold text-gray-800'>
                  {member.name}
                </h3>
                <p className='text-sm font-medium text-blue-600 mb-2'>
                  {member.role}
                </p>
                <p className='text-gray-600'>{member.bio}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className='py-16 px-4 md:px-8 lg:px-16 bg-gray-50'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className='max-w-4xl mx-auto'>
          <motion.div className='text-center mb-12' variants={fadeIn}>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
              Frequently Asked Questions
            </h2>
            <p className='text-lg text-gray-600'>
              Everything you need to know about Skill Hub and our mission
            </p>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Accordion>
              <Accordion.Panel>
                <Accordion.Title>
                  What makes Skill Hub different from other learning platforms?
                </Accordion.Title>
                <Accordion.Content>
                  <p className='mb-2 text-gray-600'>
                    Skill Hub stands out through our focus on personalized
                    learning paths, industry-expert instructors, and our vibrant
                    community. We don't just offer courses; we provide career
                    advancement opportunities through mentorship, networking,
                    and hands-on projects that reflect real-world challenges.
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title>
                  How do you select your instructors?
                </Accordion.Title>
                <Accordion.Content>
                  <p className='mb-2 text-gray-600'>
                    Our instructors are carefully selected based on their
                    industry expertise, teaching experience, and passion for
                    education. Each instructor goes through a rigorous vetting
                    process, and we regularly collect student feedback to ensure
                    the highest quality learning experience.
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title>
                  Do you offer certificates upon course completion?
                </Accordion.Title>
                <Accordion.Content>
                  <p className='mb-2 text-gray-600'>
                    Yes, all our courses include certificates of completion that
                    you can share on your LinkedIn profile or resume. For
                    certain specialized tracks, we also offer
                    industry-recognized certifications that can help advance
                    your career.
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title>
                  How can I get involved or partner with Skill Hub?
                </Accordion.Title>
                <Accordion.Content>
                  <p className='mb-2 text-gray-600'>
                    We're always looking for passionate educators, industry
                    partners, and community advocates. You can apply to become
                    an instructor, explore corporate partnerships, or join our
                    ambassador program. Visit our "Get Involved" page to learn
                    more about collaboration opportunities.
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
