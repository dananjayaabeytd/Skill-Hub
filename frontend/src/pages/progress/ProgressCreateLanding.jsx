import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from 'flowbite-react';

const ProgressCreateLanding = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProgressCreateLanding loaded with planId:', planId);
  }, [planId]);

  const handleStart = () => {
    if (!planId) {
      alert('⚠️ Plan ID is missing. Cannot proceed.');
      return;
    }

    navigate(`/progress/start/${planId}/select-template`);

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Post Your Progress</h2>
        <p className="mb-6">Click below to start posting your progress.</p>
        <Button onClick={handleStart}>
          Choose a template to add Your Progress
        </Button>
      </Card>
    </div>
  );
};

export default ProgressCreateLanding;


