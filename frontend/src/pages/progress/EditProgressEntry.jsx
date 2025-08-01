import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Label, TextInput, Textarea, Select, Button, Spinner } from 'flowbite-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

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

const EditProgressEntry = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [templateType, setTemplateType] = useState('CERTIFICATE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [resource, setResource] = useState('');


  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/progress/me`);
        const match = res.data.find((entry) => entry.id.toString() === entryId);
        if (!match) throw new Error('Progress entry not found');

        setTitle(match.title);
        setDescription(match.description);
        setDate(match.date);
        setTemplateType(match.templateType);
        setResource(match.resource || '');
        setMediaUrl(match.mediaUrls?.[0] || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to load progress entry.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [entryId]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!date) newErrors.date = 'Date is required.';
    if (!templateType) newErrors.templateType = 'Template type must be selected.';
    if (!mediaUrl) newErrors.mediaUrl = 'You must select a display image.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.put(`/progress/${entryId}`, {
        title,
        description,
        date,
        templateType,
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        resource,
      });
      toast.success('Progress updated!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update progress.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <h2 className="text-xl font-bold mb-4">Edit Progress Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Title" />
              <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="date" value="Date" />
              <TextInput type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="templateType" value="Template Type" />
              <Select id="templateType" value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
                <option value="">Select a template</option>
                <option value="CERTIFICATE">Certificate</option>
                <option value="SKILL">Skill</option>
                <option value="MILESTONE">Milestone</option>
                <option value="DAILY_LOG">Daily Log</option>
              </Select>
              {errors.templateType && <p className="text-red-600 text-sm mt-1">{errors.templateType}</p>}
            </div>

            <div>
              <Label htmlFor="resource" value="Resource (optional)" />
              <TextInput
                id="resource"
                type="url"
                placeholder="https://example.com"
                value={resource}
                onChange={(e) => setResource(e.target.value)}
              />
            </div>

            <div>
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
              {errors.mediaUrl && <p className="text-red-600 text-sm mt-1">{errors.mediaUrl}</p>}
            </div>

            <Button type="submit" gradientDuoTone="purpleToBlue">
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default EditProgressEntry;
