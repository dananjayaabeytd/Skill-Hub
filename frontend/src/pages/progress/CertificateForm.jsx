import React from 'react';
import ProgressForm from './ProgressForm';

const CertificateForm = ({ planId, onSuccess }) => (
  <ProgressForm
    planId={planId}
    defaultTemplate="CERTIFICATE"
    defaultTitle="I just earned a new certificate! 🎓"
    defaultDescription={`Excited to share that I completed my course and received a certificate of achievement! 💪\n\n#CertificateEarned #LifelongLearning #ProgressUpdate #SkillHub`}
    onSuccess={onSuccess}
  />
);

export default CertificateForm;
