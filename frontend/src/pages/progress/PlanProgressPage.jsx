import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProgressCard from './ProgressCard';
import { Button } from 'flowbite-react';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const PlanProgressPage = () => {
  const { planId } = useParams();
  const [entries, setEntries] = useState([]);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const MAX_ENTRIES = 15;

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

  useEffect(() => {
    const percent = Math.min((entries.length / MAX_ENTRIES) * 100, 100);
    let current = 0;
    const step = percent / 30;
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

  const pieData = Object.values(
    entries.reduce((acc, entry) => {
      acc[entry.templateType] = acc[entry.templateType] || { name: entry.templateType, value: 0 };
      acc[entry.templateType].value++;
      return acc;
    }, {})
  );

  return (
    <div className="relative max-w mx-auto py-10 px-4 flex gap-6 bg-[#f9fafb] min-h-screen">

      {/* Title Section */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Your Progress on{' '}
          <span
            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
            onClick={() => navigate(`/plans/view/${planId}`)}
          >
            Plan!
          </span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-24">
        <div className="mb-6 flex justify-center gap-2">
          <Button onClick={() => setShowSidebar((prev) => !prev)} color="gray">
            {showSidebar ? 'Hide Insights' : 'Show Insights'}
          </Button>
          <Button
            onClick={() => navigate(`/progress/start/${planId}/select-template`)}
            gradientDuoTone="purpleToBlue"
          >
            + Add Progress
          </Button>
        </div>


        {/* Progress Bar */}
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-5xl px-6">
            <div className="bg-gray-200 rounded-full h-14 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-14 transition-all duration-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ width: `${animatedPercent}%` }}
              >
                {animatedPercent}%
              </div>
            </div>
            <div className="mt-4 text-center text-xl font-semibold">
              {animatedPercent < 100 ? (
                <span className="text-gray-800">
                  You're {animatedPercent}% there, keep it up!
                </span>
              ) : (
                <span className="text-green-600">
                  🎉 Congratulations! Your plan is completed!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex flex-col items-center gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="w-full max-w-3xl">
              <ProgressCard
                entry={entry}
                user={{ userName: entry.userName, userImage: entry.userImage }}
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
            </div>
          ))}
        </div>
      </div>

      {/* Insights Sidebar */}
      {showSidebar && entries.length > 0 && (
        <div className="w-full lg:w-[350px] xl:w-[400px] bg-white border rounded-lg p-4 shadow-sm sticky top-10 h-fit hidden lg:block overflow-y-auto max-h-[85vh]">
          <h4 className="text-lg font-semibold mb-4 text-center">Progress Insights</h4>

          {/* Line Chart */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Entries Over Time</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[...entries].reverse()}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="id" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Progress Percentage Over Time</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[...entries].map((entry, index) => ({
                  date: new Date(entry.date).toLocaleDateString(),
                  progress: Math.min(Math.round(((index + 1) / MAX_ENTRIES) * 100), 100),
                }))}
              >
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <p className="text-sm font-medium mb-2">Progress Type Breakdown</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={['#6366f1', '#60a5fa', '#34d399', '#facc15'][i % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={() => navigate('/payment')}
              gradientDuoTone="purpleToBlue"
              className="w-full"
            >
              Download Insights
            </Button>
          </div>


        </div>
      )}
    </div>
  );
};

export default PlanProgressPage;
