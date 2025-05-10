import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Select,
  Spinner,
  Checkbox,
} from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const EditLearningPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedStartDate, setExpectedStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [skillId, setSkillId] = useState('');
  const [skills, setSkills] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, itemsRes, skillsRes] = await Promise.all([
          api.get(`/learning-plans/${id}`),
          api.get(`/learning-plans/${id}/items`),
          api.get('/skills'),
        ]);

        const plan = planRes.data;
        setTitle(plan.title);
        setDescription(plan.description);
        setExpectedStartDate(plan.expectedStartDate || '');
        setExpectedEndDate(plan.expectedEndDate || '');
        setStatus(plan.status || 'NOT_STARTED');
        setSkillId(plan.skill?.skillId || '');
        setSkills(skillsRes.data || []);

        const fetchedItems = itemsRes.data || [];
        const cleaned = fetchedItems.map(item => ({
          topic: item.topic || '',
          resource: item.resource || '',
          deadline: item.deadline || '',
          completed: item.completed || false
        }));

        setItems(cleaned);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load plan data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { topic: '', resource: '', deadline: '', completed: false }]);
  };

  const handleDeleteItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
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

    const payload = {
      title,
      description,
      expectedStartDate,
      expectedEndDate,
      expectedDurationDays: calculateDuration(),
      status,
      skill: skillId ? { skillId: parseInt(skillId, 10) } : null,
      items,
    };

    try {
      await api.put(`/learning-plans/${id}`, payload);
      toast.success('Plan updated successfully!');
      navigate('/plans');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update plan');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4">
      <section className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border border-gray-200 bg-white/90 backdrop-blur">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">Edit Learning Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Plan Title" className="mb-1" />
              <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} required shadow />
            </div>

            <div>
              <Label htmlFor="description" value="Description" className="mb-1" />
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
                <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)} shadow>
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
                    <option key={skill.skillId} value={skill.skillId}>
                      {skill.skillName}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label value="Topics & Tasks" className="mb-2" />
              {items.map((item, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 mb-3 items-center">
                  <TextInput
                    placeholder="Topic"
                    value={item.topic}
                    onChange={(e) => handleItemChange(index, 'topic', e.target.value)}
                    required
                    shadow
                  />
                  <TextInput
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
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={item.completed || false}
                      onChange={(e) => handleItemChange(index, 'completed', e.target.checked)}
                    />
                    <span className="text-sm">Done</span>
                    <Button
                      type="button"
                      color="failure"
                      size="xs"
                      onClick={() => handleDeleteItem(index)}
                      className="w-7 h-7 p-1 flex items-center justify-center"
                    >
                      <HiTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={handleAddItem} className="mt-2">
                + Add Task
              </Button>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="w-52 text-lg font-semibold">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default EditLearningPlan;
