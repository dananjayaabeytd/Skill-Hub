import React from 'react';
import ProgressForm from './ProgressForm';

const SkillForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="SKILL"
    defaultTitle="New Skill Unlocked! 🔓"
    defaultDescription={`Just learned something new and I’m excited to apply it! 🎯

#SkillUnlocked #KeepGrowing #ProgressJourney #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default SkillForm;
