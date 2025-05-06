import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const predefinedImages = [
  '/images/image1.png',
  '/images/image2.png',
  '/images/image7.png',
  '/images/image9.png',
  '/images/image12.png',
  '/images/image3.png',
  '/images/image4.png',
  '/images/image11.png',
  '/images/image8.png',
  '/images/image5.png',
  '/images/image6.png',
  '/images/image10.png',
];

const ProgressForm = ({
  planId,
  defaultTemplate,
  defaultTitle = '',
  defaultDescription = '',
  onSuccess,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [date, setDate] = useState('');
  const [template, setTemplate] = useState(defaultTemplate || 'CERTIFICATE');
  const [mediaUrl, setMediaUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultTemplate) setTemplate(defaultTemplate);
    setTitle(defaultTitle);
    setDescription(defaultDescription);
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
  }, [defaultTemplate, defaultTitle, defaultDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error('Title cannot be empty!');
    if (!description.trim()) return toast.error('Description cannot be empty!');
    if (!date) return toast.error('Date is required!');

    try {
      const token = localStorage.getItem('JWT_TOKEN');
      await api.post(
        `/progress/${planId}`,
        {
          title,
          description,
          date,
          templateType: template,
          mediaUrls: mediaUrl ? [mediaUrl] : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Your progress is uploaded successfully!');
      if (onSuccess) onSuccess();
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

      {/* Template Image Selection (independent of template type) */}
      <div className="space-y-2">
        <Label value="Choose a display image" />
        <div className="flex flex-wrap gap-4">
          {predefinedImages.map((img) => (
            <img
              key={img}
              src={img}
              alt="template"
              onClick={() => setMediaUrl(img)}
              className={`w-40 h-28 object-cover rounded-lg cursor-pointer border-4 ${
                mediaUrl === img ? 'border-blue-500' : 'border-transparent'
              }`}
            />
          ))}
        </div>
        {mediaUrl && (
          <img
            src={mediaUrl}
            alt="Selected"
            className="mt-4 h-40 object-cover rounded-lg"
          />
        )}
      </div>

      <Button type="submit" gradientDuoTone="purpleToBlue">
        Upload Progress
      </Button>
    </form>
  );
};

export default ProgressForm;
