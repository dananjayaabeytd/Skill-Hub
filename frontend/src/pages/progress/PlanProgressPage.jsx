

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProgressCard from './ProgressCard';
import { Button } from 'flowbite-react';
import toast from 'react-hot-toast';

const PlanProgressPage = () => {
  const { planId } = useParams();
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Plan Progress</h2>
        <Button onClick={() => navigate(`/progress/create/${planId}`)} gradientDuoTone="purpleToBlue">
          + Add Progress
        </Button>
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <ProgressCard
            key={entry.id}
            entry={entry}
            isOwner={true}
            onEdit={() => navigate(`/progress/edit/${entry.id}`)} // If you have an edit route
            onDelete={async () => {
              try {
                await api.delete(`/progress/${entry.id}`);
                toast.success('Entry deleted');
                fetchEntries(); // refresh list
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
