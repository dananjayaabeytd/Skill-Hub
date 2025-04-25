import React from 'react';
import ProgressForm from './ProgressForm';

const ProjectForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="PROJECT"
    defaultTitle="Project Completed Successfully! 🚀"
    defaultDescription={`Just wrapped up a challenging and rewarding project. Proud of what I built! 🛠️

#ProjectDone #BuildInPublic #CodingLife #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default ProjectForm;
