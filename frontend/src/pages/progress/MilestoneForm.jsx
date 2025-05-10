import React from 'react';
import ProgressForm from './ProgressForm';

const MilestoneForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="MILESTONE"
    defaultTitle="Milestone Achieved! 🏁"
    defaultDescription={`Hit a major learning milestone today. Celebrating the small wins! 🎉

#MilestoneAchieved #KeepMovingForward #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default MilestoneForm;
