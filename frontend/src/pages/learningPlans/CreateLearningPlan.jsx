import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Select
} from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreateLearningPlan = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedStartDate, setExpectedStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [postId, setPostId] = useState('');
  const [skillId, setSkillId] = useState('');
  const [skills, setSkills] = useState([]);
  const [items, setItems] = useState([
    { topic: '', resource: '', deadline: '', completed: false },
  ]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(res.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { topic: '', resource: '', deadline: '', completed: false }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateDuration = () => {
    if (expectedStartDate && expectedEndDate) {
      const start = new Date(expectedStartDate);
      const end = new Date(expectedEndDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return diff >= 0 ? diff : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expectedDurationDays = calculateDuration();

    const planData = {
      title,
      description,
      expectedStartDate,
      expectedEndDate,
      expectedDurationDays,
      status,
      postId: postId ? parseInt(postId, 10) : null,
      skill: skillId ? { skillId: parseInt(skillId, 10) } : null,
      items,
    };

    try {
      await api.post('/learning-plans', planData);
      toast.success('Plan created successfully!');
      navigate('/plans');
    } catch (error) {
      console.error('Failed to create plan:', error);
      toast.error('Failed to create plan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4">
      <section className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border border-gray-200 bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">Create a New Learning Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Plan Title" className="mb-1" />
              <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} required shadow />
            </div>

            <div>
              <Label htmlFor="description" value="Plan Description" className="mb-1" />
              <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} shadow />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label value="Expected Start Date" className="mb-1" />
                <TextInput type="date" value={expectedStartDate} onChange={(e) => setExpectedStartDate(e.target.value)} shadow />
              </div>
              <div>
                <Label value="Expected End Date" className="mb-1" />
                <TextInput type="date" value={expectedEndDate} onChange={(e) => setExpectedEndDate(e.target.value)} shadow />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label value="Status" className="mb-1" />
                <Select value={status} onChange={(e) => setStatus(e.target.value)} shadow>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </Select>
              </div>

              <div>
                <Label value="Skill" className="mb-1" />
                <Select value={skillId} onChange={(e) => setSkillId(e.target.value)} shadow>
                  <option value="">Select a skill</option>
                  {skills.map((skill) => (
                    <option key={skill.skillId} value={skill.skillId}>{skill.skillName}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label value="Topics & Tasks" className="mb-2" />
              {items.map((item, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 mb-3">
                  <TextInput
                    type="text"
                    placeholder={`Topic ${index + 1}`}
                    value={item.topic}
                    onChange={(e) => handleItemChange(index, 'topic', e.target.value)}
                    required
                    shadow
                  />
                  <TextInput
                    type="text"
                    placeholder="Resource (optional)"
                    value={item.resource}
                    onChange={(e) => handleItemChange(index, 'resource', e.target.value)}
                    shadow
                  />
                  <TextInput
                    type="date"
                    value={item.deadline}
                    onChange={(e) => handleItemChange(index, 'deadline', e.target.value)}
                    shadow
                  />
                </div>
              ))}
              <Button type="button" onClick={handleAddItem} className="mt-2">
                + Add Task
              </Button>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="w-52 text-lg font-semibold">
                Submit Plan
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default CreateLearningPlan;
