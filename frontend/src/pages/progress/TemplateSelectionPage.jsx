import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Modal } from 'flowbite-react';
import CertificateForm from './CertificateForm';
import ProjectForm from './ProjectForm';
import WorkshopForm from './WorkshopForm';
import SkillForm from './SkillForm';
import MilestoneForm from './MilestoneForm';
import DailyLogForm from './DailyLogForm';
import CodeDemoForm from './CodeDemoForm';


const templates = [
  { id: 'CERTIFICATE', title: 'Certificate Achievement', image: '/images/certificate-template.jpg' },
  { id: 'PROJECT', title: 'Project Completion', image: '/images/project-template.jpg' },
  { id: 'WORKSHOP', title: 'Workshop Attendance', image: '/images/workshop-template.jpg' },
  { id: 'SKILL', title: 'Skill Milestone', image: '/images/skill-template.jpg' },
  { id: 'MILESTONE', title: 'Milestone Achievement', image: '/images/milestone-template.jpg' },
  { id: 'DAILY_LOG', title: 'Daily Log Entry', image: '/images/dailylog-template.jpg' },
  { id: 'CODE_DEMO', title: 'Code Demo', image: '/images/code-demo-template.jpg' }, 
  
];

const TemplateSelectionPage = () => {
  const { planId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const renderForm = () => {
    const props = { planId, onSuccess: () => setSelectedTemplate(null) };
    switch (selectedTemplate) {
      case 'CERTIFICATE':
        return <CertificateForm {...props} />;
      case 'PROJECT':
        return <ProjectForm {...props} />;
      case 'WORKSHOP':
        return <WorkshopForm {...props} />;
      case 'SKILL':
        return <SkillForm {...props} />;
      case 'MILESTONE':
        return <MilestoneForm {...props} />;
      case 'DAILY_LOG':
        return <DailyLogForm {...props} />;
      case 'CODE_DEMO':
        return <CodeDemoForm {...props} />;
          
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Choose a Template</h2>

      <div className="overflow-x-auto">
        <div className="flex space-x-6 pb-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="w-80 h-[35rem] flex-shrink-0 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex flex-col items-center text-center">
                <h5 className="text-lg font-semibold text-gray-800 mb-2">{template.title}</h5>
                <div className="w-60 h-[30rem] rounded overflow-hidden mb-4 border border-gray-200">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal show={!!selectedTemplate} onClose={() => setSelectedTemplate(null)}>
        <Modal.Header>Create Progress</Modal.Header>
        <Modal.Body>{renderForm()}</Modal.Body>
      </Modal>
    </div>
  );
};

export default TemplateSelectionPage;
