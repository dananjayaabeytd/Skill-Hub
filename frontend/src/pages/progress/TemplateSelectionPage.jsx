import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Modal } from 'flowbite-react';
import CertificateForm from './CertificateForm';
import SkillForm from './SkillForm';
import MilestoneForm from './MilestoneForm';
import DailyLogForm from './DailyLogForm';
import { motion } from 'framer-motion';

const templates = [
  { id: 'CERTIFICATE', title: 'Certificate Achievement', image: '/images/certificate-template.png' },
  { id: 'MILESTONE', title: 'Milestone Achievement', image: '/images/image12.png' },
  { id: 'DAILY_LOG', title: 'Daily Log Entry', image: '/images/image11.png' },
  { id: 'SKILL', title: 'Customize Your Skill Template', image: '/images/custom-template.png' },
];

const TemplateSelectionPage = () => {
  const { planId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const renderForm = () => {
    const props = { planId, onSuccess: () => setSelectedTemplate(null) };
    switch (selectedTemplate) {
      case 'CERTIFICATE': return <CertificateForm {...props} />;
      case 'SKILL': return <SkillForm {...props} />;
      case 'MILESTONE': return <MilestoneForm {...props} />;
      case 'DAILY_LOG': return <DailyLogForm {...props} />;
      default: return null;
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
    className="p-8 min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h2
        className="text-4xl font-extrabold mb-12 text-center text-gray-800"
        variants={fadeIn}
      >
        Go with your template!
      </motion.h2>

      <motion.div className="overflow-x-auto pb-10" variants={fadeIn}>
        <div className="flex space-x-10 justify-center">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card
                className="w-80 h-[32rem] flex-shrink-0 cursor-pointer hover:shadow-xl border-2 border-gray-100 transition-all"
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">{template.title}</h5>
                  <div className="w-64 h-72 rounded overflow-hidden border border-gray-200">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Modal show={!!selectedTemplate} onClose={() => setSelectedTemplate(null)}>
        <Modal.Header>Create Progress</Modal.Header>
        <Modal.Body>{renderForm()}</Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default TemplateSelectionPage;
