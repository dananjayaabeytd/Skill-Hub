import React from 'react';
import ProgressForm from './ProgressForm';

const WorkshopForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="WORKSHOP"
    defaultTitle="Attended a great workshop! 🧠"
    defaultDescription={`I participated in a hands-on workshop that really expanded my skills and understanding.

#WorkshopWin #LearningByDoing #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default WorkshopForm;
