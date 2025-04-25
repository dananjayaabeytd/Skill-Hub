import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ProgressCard from './ProgressCard';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UserProgress = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('/progress/me');
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to fetch user progress');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.planId]) acc[entry.planId] = [];
    acc[entry.planId].push(entry);
    return acc;
  }, {});

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-10"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h2 className="text-2xl font-bold mb-6" variants={fadeIn}>
        My Progress Entries
      </motion.h2>
      {Object.entries(grouped).map(([planId, items], index) => (
        <motion.div key={planId} className="mb-10" variants={fadeIn}>
          <h3 className="text-xl font-semibold mb-4">Plan ID: {planId}</h3>
          <div className="space-y-4">
            {items.map((entry) => (
              <motion.div key={entry.id} variants={fadeIn}>
                <ProgressCard
                  entry={entry}
                  isOwner={true}
                  onEdit={() => navigate(`/progress/edit/${entry.id}`)}
                  onDelete={async () => {
                    try {
                      await api.delete(`/progress/${entry.id}`);
                      toast.success('Entry deleted');
                      fetchData();
                    } catch (err) {
                      toast.error('Failed to delete entry');
                    }
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserProgress;
