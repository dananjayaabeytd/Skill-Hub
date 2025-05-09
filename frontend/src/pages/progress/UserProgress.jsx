import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ProgressCard from './ProgressCard';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MAX_ENTRIES = 10;

const UserProgress = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const groupByPlan = (entries) => {
    const plans = {};
    entries.forEach((entry) => {
      if (!plans[entry.planId]) {
        plans[entry.planId] = [];
      }
      plans[entry.planId].push(entry);
    });

    return Object.entries(plans).map(([planId, entries]) => ({
      planId,
      entries,
      percent: Math.min((entries.length / MAX_ENTRIES) * 100, 100),
    }));
  };

  const plans = groupByPlan(entries);
  const ongoingPlans = plans.filter((plan) => plan.percent < 100);
  const completedPlans = plans.filter((plan) => plan.percent === 100);

  const displayedEntries =
    filter === 'all'
      ? entries
      : entries.filter((entry) => entry.planId === selectedPlanId);

  return (
    <motion.div
      className="flex gap-3 bg-gray-100 px-4 py-10 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Center Content */}
      <div className="flex-1 max-w-4xl mx-auto">
        <motion.h2 className="text-3xl font-bold mb-6 text-center" variants={fadeIn}>
          My Feed!
        </motion.h2>

        {filter !== 'all' && (
          <div className="mb-6 text-center">
            <button
              onClick={() => {
                setFilter('all');
                setSelectedPlanId(null);
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-sm rounded-full"
            >
              ← Back to All Posts
            </button>
          </div>
        )}

        <div className="space-y-6">
          {displayedEntries.length === 0 ? (
            <p className="text-center text-gray-600">No progress posts found.</p>
          ) : (
            displayedEntries.map((entry) => (
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
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-[300px] hidden lg:block">
        <div className="sticky top-10 bg-white rounded-xl shadow p-4 border">
          <h4 className="text-lg font-bold mb-4 text-center">📌 Plans</h4>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Ongoing Plans</p>
            {ongoingPlans.length === 0 ? (
              <p className="text-xs text-gray-500">No ongoing plans</p>
            ) : (
              ongoingPlans.map((plan) => (
                <div key={plan.planId} className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => {
                      setFilter('plan');
                      setSelectedPlanId(plan.planId);
                    }}
                    className="flex-1 text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded"
                  >
                    Plan {plan.planId} - {plan.percent}%
                  </button>
                  <button
                    onClick={() => navigate(`/progress/plan/${plan.planId}`)}
                    className="ml-2 text-blue-600 hover:underline text-xs"
                    title="View full plan progress"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Completed Plans</p>
            {completedPlans.length === 0 ? (
              <p className="text-xs text-gray-500">No completed plans</p>
            ) : (
              completedPlans.map((plan) => (
                <div key={plan.planId} className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => {
                      setFilter('plan');
                      setSelectedPlanId(plan.planId);
                    }}
                    className="flex-1 text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded"
                  >
                    ✅ Plan {plan.planId}
                  </button>
                  <button
                    onClick={() => navigate(`/progress/plan/${plan.planId}`)}
                    className="ml-2 text-blue-600 hover:underline text-xs"
                    title="View full plan progress"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProgress;
