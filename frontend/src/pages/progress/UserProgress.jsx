import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ProgressCard from './ProgressCard';

import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProgress = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate(); // ⬅ Add this

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">My Progress Entries</h2>
      {Object.entries(grouped).map(([planId, items]) => (
        <div key={planId} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Plan ID: {planId}</h3>
          <div className="space-y-4">
            {items.map((entry) => (
              <ProgressCard
                key={entry.id}
                entry={entry}
                isOwner={true}
                onEdit={() => navigate(`/progress/edit/${entry.id}`)}
                onDelete={async () => {
                  try {
                    await api.delete(`/progress/${entry.id}`);
                    toast.success('Entry deleted');
                    fetchData(); // ⬅ Refresh list
                  } catch (err) {
                    toast.error('Failed to delete entry');
                  }
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProgress;