import React from 'react';
import ProgressForm from './ProgressForm';

const SkillForm = ({ planId, onSuccess }) => (
  <>
    <h2>Customize Your Template!</h2>
    <ProgressForm
      planId={planId}
      defaultTemplate="SKILL"
      defaultTitle="New Skill Unlocked! 🔓"
      defaultDescription={`Customize your new skill entry below to highlight what you've learned and how you plan to apply it. 🚀

#SkillUnlocked #KeepGrowing #ProgressJourney #SkillHub`}
      onSuccess={onSuccess}
    />
  </>
);

export default SkillForm;
