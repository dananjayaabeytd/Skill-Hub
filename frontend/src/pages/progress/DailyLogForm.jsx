import React from 'react';
import ProgressForm from './ProgressForm';

const DailyLogForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="DAILY_LOG"
    defaultTitle="Daily Learning Log 📔"
    defaultDescription={`Today I focused on making steady progress. One step at a time. 💡

#DailyLog #ConsistentLearning #ProgressNotPerfection #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default DailyLogForm;
