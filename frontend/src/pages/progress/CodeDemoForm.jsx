import React from 'react';
import ProgressForm from './ProgressForm';

const CodeDemoForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="CODE_DEMO"
    defaultTitle="Check out my latest code demo! 💻"
    defaultDescription={`I just built a cool feature or demo and I'm excited to share it with you!

#CodeDemo #BuiltWithLove #DevLife #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default CodeDemoForm;
