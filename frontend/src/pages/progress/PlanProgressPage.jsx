import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProgressCard from './ProgressCard';
import { Button } from 'flowbite-react';
import toast from 'react-hot-toast';

const PlanProgressPage = () => {
  const { planId } = useParams();
  const [entries, setEntries] = useState([]);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const navigate = useNavigate();
  const MAX_ENTRIES = 20;

  const fetchEntries = async () => {
    try {
      const res = await api.get(`/progress/plan/${planId}`);
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to load progress entries');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [planId]);

  // Animate the percentage from 0 to actual percent
  useEffect(() => {
    const percent = Math.min((entries.length / MAX_ENTRIES) * 100, 100);
    let current = 0;
    const step = percent / 30; // speed of animation
    const interval = setInterval(() => {
      current += step;
      if (current >= percent) {
        setAnimatedPercent(Math.round(percent));
        clearInterval(interval);
      } else {
        setAnimatedPercent(Math.round(current));
      }
    }, 20);
    return () => clearInterval(interval);
  }, [entries]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Section: Title + Button */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
          <span
            className="text-blue-600 underline cursor-pointer hover:text-blue-800 text-sm"
            onClick={() => navigate(`/plans/view/${planId}`)}
          >
            Check the plan
          </span>
        </div>
        <Button onClick={() => navigate(`/progress/start/${planId}`)} gradientDuoTone="purpleToBlue">
          + Add Progress
        </Button>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-10 mb-6 shadow-inner">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-10 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-500"
          style={{ width: `${animatedPercent}%` }}
        >
          {animatedPercent}%
        </div>
      </div>



      {/* Progress Entries List */}
      <div className="space-y-6">
        {entries.map((entry) => (
          <ProgressCard
            key={entry.id}
            entry={entry}
            isOwner={true}
            onEdit={() => navigate(`/progress/edit/${entry.id}`)}
            onDelete={async () => {
              try {
                await api.delete(`/progress/${entry.id}`);
                toast.success('Entry deleted');
                fetchEntries();
              } catch (err) {
                toast.error('Failed to delete entry');
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanProgressPage;

