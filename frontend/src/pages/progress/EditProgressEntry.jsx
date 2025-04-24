import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Label, TextInput, Textarea, Select, Button, Spinner } from 'flowbite-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EditProgressEntry = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [templateType, setTemplateType] = useState('CERTIFICATE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/progress/me`); // no single-entry endpoint
        const match = res.data.find((entry) => entry.id.toString() === entryId);
        if (!match) throw new Error('Progress entry not found');

        setTitle(match.title);
        setDescription(match.description);
        setDate(match.date);
        setTemplateType(match.templateType);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load progress entry.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [entryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/progress/${entryId}`, {
        title,
        description,
        date,
        templateType,
      });
      toast.success('Progress updated!');
      navigate(-1); // go back to previous page
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
    <section className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <h2 className="text-xl font-bold mb-4">Edit Progress Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description" value="Description" />
            <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date" value="Date" />
            <TextInput type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="templateType" value="Template Type" />
            <Select id="templateType" value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
              <option value="CERTIFICATE">Certificate</option>
              <option value="SKILL">Skill</option>
              <option value="MILESTONE">Milestone</option>
              <option value="DAILY_LOG">Daily Log</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToBlue">Save Changes</Button>
        </form>
      </Card>
    </section>
  );
};

export default EditProgressEntry;
