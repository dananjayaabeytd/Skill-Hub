import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Label, Select, TextInput, Textarea } from 'flowbite-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreateProgressEntry = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [templateType, setTemplateType] = useState('CERTIFICATE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/progress/${planId}`, {
        title,
        description,
        date,
        templateType,
      });
      toast.success('Progress entry created!');
      navigate(`/plans/view/${planId}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create progress entry.');
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <h2 className="text-xl font-bold mb-4">Create Progress Entry</h2>
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
          <Button type="submit" gradientDuoTone="purpleToBlue">Submit Progress</Button>
        </form>
      </Card>
    </section>
  );
};

export default CreateProgressEntry;