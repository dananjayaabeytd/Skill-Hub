import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Badge } from 'flowbite-react';
import { format } from 'date-fns';

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

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Community Progress Feed</h2>

      {entries.length === 0 ? (
        <p className="text-gray-500">No progress posts available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition">
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
              <div className="flex flex-wrap gap-2 text-sm mb-2">
                <Badge color="info">{entry.templateType}</Badge>
                <Badge color="gray">{format(new Date(entry.date), 'yyyy-MM-dd')}</Badge>
              </div>
              <p className="text-xs text-gray-500">
                Plan ID: {entry.planId} | User ID: {entry.userId}
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllProgressPosts;
