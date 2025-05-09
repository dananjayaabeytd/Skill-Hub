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
import { differenceInCalendarDays, parseISO } from 'date-fns';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size'; // optional for dynamic screen size

const PlanProgressPage = () => {
  const { planId } = useParams();
  const [entries, setEntries] = useState([]);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize(); // gets dynamic window size

  const MAX_ENTRIES = 10;

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

  useEffect(() => {
    const shownBadges = JSON.parse(localStorage.getItem('shownBadges') || '[]');
    let updatedEarnedBadges = [...earnedBadges]; // start with what we already have
    let newPopupBadge = null;
  
    const alreadyEarnedLabels = new Set(earnedBadges.map(b => b.label));
  
    const addBadge = (badge) => {
      const isAlreadyEarned = alreadyEarnedLabels.has(badge.label);
      const wasPopupShown = shownBadges.includes(badge.label);
  
      if (!isAlreadyEarned) {
        updatedEarnedBadges.push(badge); // add to sidebar
      }
  
      if (!wasPopupShown) {
        localStorage.setItem('shownBadges', JSON.stringify([...shownBadges, badge.label]));
        if (!newPopupBadge) newPopupBadge = badge; // only pop one
      }
    };
  
    // First Post
    if (entries.length >= 1) {
      addBadge({
        icon: '🥇',
        label: 'First Post',
        desc: 'You made your first post in this plan!\nReveal more Rewards, GO AHEAD!',
      });
    }
  
    // Halfway
    if (entries.length >= MAX_ENTRIES / 2) {
      addBadge({
        icon: '🏅',
        label: 'Halfway There',
        desc: 'You reached 50% progress!\n KEEP IT UP!',
      });
    }

    // 85% Milestone
    if (entries.length >= Math.ceil(MAX_ENTRIES * 0.85)) {
      addBadge({
        icon: '🚀',
        label: 'Almost There',
        desc: 'You have completed 85% of your plan!\nFinal steps remain!',
      });
    }

    // Completion Badge
    if (entries.length >= MAX_ENTRIES) {
      addBadge({
        icon: '🏆',
        label: 'Plan Completed',
        desc: 'Congratulations on completing your entire plan!\nYou did it!',
      });

      setShowConfetti(true); // 🎉 Start confetti
      setTimeout(() => setShowConfetti(false), 6000); // ⏱️ stop after 5s
    }



  
  // 🔁 1. Calculate streaks
  const streaks = getConsecutiveStreak(entries);
  const lastStreak = parseInt(localStorage.getItem('lastStreak') || '0');
  const streakLabel = `${streaks}-Day Streak`;

  // 🔥 2. Add streak badge if new
  const alreadyEarned = updatedEarnedBadges.some(b => b.label === streakLabel);
  if (streaks >= 2 && !alreadyEarned) {
    const badge = {
      icon: '🔥',
      label: streakLabel,
      desc: `You Unlocked a New Streak!\nYou've posted for ${streaks} consecutive days!`,
    };

    updatedEarnedBadges.push(badge);

    if (streaks === 2 && !shownBadges.includes(badge.label)) {
      localStorage.setItem('shownBadges', JSON.stringify([...shownBadges, badge.label]));
      newPopupBadge = badge;
    } else if (streaks > 2) {
      toast.success(`🔥 You're on a ${streaks}-day streak!`);
    }
  }

  // 📝 3. Save current streak
  localStorage.setItem('lastStreak', streaks.toString());



  
    // Always update the full earned badge list
    setEarnedBadges(updatedEarnedBadges);
  
    // Trigger popup once for the newly earned badge
    if (newPopupBadge) {
      setNewBadge(newPopupBadge);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    }
  }, [entries]);
  

  const getConsecutiveStreak = (entries) => {
    if (!entries.length) return 0;
    const dates = [...new Set(entries.map(e => parseISO(e.date)).map(d => d.toISOString().split('T')[0]))]
      .map(d => new Date(d))
      .sort((a, b) => b - a);

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = differenceInCalendarDays(dates[i - 1], dates[i]);
      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        break;
      }
    }
    return streak;
  };

  const pieData = Object.values(
    entries.reduce((acc, entry) => {
      acc[entry.templateType] = acc[entry.templateType] || { name: entry.templateType, value: 0 };
      acc[entry.templateType].value++;
      return acc;
    }, {})
  );

  return (
    <div className="relative flex gap-6 bg-[#f9fafb] min-h-screen px-4 py-10">
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          color="failure"
          onClick={() => {
            localStorage.removeItem('shownBadges');
            toast.success('Badge popups reset');
          }}
        >
          🔄 Reset Badge Popups
        </Button>
      </div>

      {/* Left Badge Sidebar */}
      <div className="w-64 bg-white border rounded-2xl p-4 shadow-md h-fit sticky top-10 hidden lg:block">
      <h4 className="text-lg font-bold mb-4 text-center text-black">🧭 Your Badges, Keep Going!</h4>
        {earnedBadges.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No badges earned yet.</p>
        ) : (
          <div className="space-y-4">
            {earnedBadges.map((badge, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-200 h-28">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{badge.label}</p>
                    <p className="text-xs text-gray-500">{badge.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Center Content */}
      <div className="flex-1">
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
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-14 flex items-center justify-center text-white font-bold text-lg transition-all duration-500 rounded-full"
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

        {/* Progress Entries */}
        <div className="flex flex-col items-center gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="w-full max-w-4xl">
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

      {/* Right Insights Sidebar */}
      {showSidebar && entries.length > 0 && (
        <div className="w-full lg:w-[350px] xl:w-[400px] bg-white border rounded-lg p-4 shadow-sm sticky top-10 h-fit hidden lg:block overflow-y-auto max-h-[85vh]">
          <h4 className="text-lg font-semibold mb-4 text-center">Progress Insights</h4>
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Entries Over Time</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[...entries].reverse()}>
                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="id" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Progress Percentage Over Time</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={entries.map((entry, index) => ({
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
                    <Cell key={i} fill={['#6366f1', '#60a5fa', '#34d399', '#facc15'][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-center">
            <Button onClick={() => navigate('/payment')} gradientDuoTone="purpleToBlue" className="w-full">
              Download Insights
            </Button>
          </div>
        </div>
      )}

      {/* Badge Popup */}
      {showPopup && newBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-12 w-[500px] text-center animate-bounce">
            <h3 className="text-2xl font-bold mb-4 text-green-600">🎉 New Badge Earned!</h3>
            <div>
              <div className="text-5xl">{newBadge.icon}</div>
              <p className="font-semibold mt-2">{newBadge.label}</p>
              <p className="text-lg text-gray-500 whitespace-pre-line">{newBadge.desc}</p>
            </div>
          </div>
        </div>
      )}
    {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} />}
    </div>
  );
};

export default PlanProgressPage;

