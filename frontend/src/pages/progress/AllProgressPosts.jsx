import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Badge } from 'flowbite-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AllProgressPosts = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/progress/all');
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch all progress posts');
      }
    };
    fetchAll();
  }, []);

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  });

  const chunks = chunkArray(entries, 4); // 4 cards per chunk

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-10"
    >
      <motion.h2
        className="text-3xl font-bold mb-6"
        variants={fadeIn(0)}
        initial="hidden"
        animate="visible"
      >
        Community Progress Feed
      </motion.h2>

      {entries.length === 0 ? (
        <motion.p className="text-gray-500" variants={fadeIn(0.1)} initial="hidden" animate="visible">
          No progress posts available yet.
        </motion.p>
      ) : (
        chunks.map((chunk, chunkIndex) => (
          <motion.div
            key={chunkIndex}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            variants={fadeIn(chunkIndex * 0.5)}
            initial="hidden"
            animate="visible"
          >
            {chunk.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition">
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                <div className="flex flex-wrap gap-2 text-sm mb-2">
                  <Badge color="info">{entry.templateType}</Badge>
                  <Badge color="gray">{format(new Date(entry.date), 'yyyy-MM-dd')}</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  View followed plan:{' '}
                  <span
                    className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                    onClick={() => window.location.href = `/plans/view/${entry.planId}`}
                  >
                    {entry.planId}
                  </span>{' '}
                  | User ID: {entry.userId}
                </p>
              </Card>
            ))}
          </motion.div>
        ))
      )}
    </motion.section>
  );
};

export default AllProgressPosts;

