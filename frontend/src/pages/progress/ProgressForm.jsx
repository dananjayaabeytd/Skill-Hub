import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ProgressForm = ({ planId, defaultTemplate, defaultTitle = '', defaultDescription = '', onSuccess }) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [date, setDate] = useState('');
  const [template, setTemplate] = useState(defaultTemplate || 'CERTIFICATE');
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultTemplate) {
      setTemplate(defaultTemplate);
    }
    setTitle(defaultTitle);
    setDescription(defaultDescription);

    // Set today's date automatically
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setDate(formattedToday);
  }, [defaultTemplate, defaultTitle, defaultDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Title cannot be empty!');
      return;
    }
    if (!description.trim()) {
      toast.error('Description cannot be empty!');
      return;
    }
    if (!date) {
      toast.error('Date is required!');
      return;
    }

    try {
      const token = localStorage.getItem('JWT_TOKEN');
      await api.post(
        `/progress/${planId}`,
        {
          title,
          description,
          date,
          templateType: template,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Your progress is uploaded successfully!');
      if (onSuccess) {
        onSuccess();
      }
      navigate('/progress/all');
    } catch (err) {
      console.error('Error creating progress entry:', err);
      toast.error('Failed to create progress entry.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div>
        <Label htmlFor="title" value="Title" />
        <TextInput
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description" value="Description" />
        <Textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date" value="Date" />
        <TextInput
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <Button type="submit" gradientDuoTone="purpleToBlue">
        Upload Progress
      </Button>
    </form>
  );
};

export default ProgressForm;


