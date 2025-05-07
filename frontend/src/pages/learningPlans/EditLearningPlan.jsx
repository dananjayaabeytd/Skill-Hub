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
import { MenuBar } from '../../components/shared/Navbar';
import { FooterComponent } from '../../components/shared/Footer';
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
  const [items, setItems] = useState([]);
  const [skillId, setSkillId] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanAndItems = async () => {
      try {
        const [planRes, itemsRes] = await Promise.all([
          api.get(`/learning-plans/${id}`),
          api.get(`/learning-plans/${id}/items`),
          api.get(`/skills`),
        ]);

        const plan = planRes.data;
        setTitle(plan.title);
        setDescription(plan.description);
        setExpectedStartDate(plan.expectedStartDate || '');
        setExpectedEndDate(plan.expectedEndDate || '');
        setStatus(plan.status || 'NOT_STARTED');
        setSkillId(plan.skill?.skillId || '');
        setSkills(skills.data || []);

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

    fetchPlanAndItems();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        topic: '',
        resource: '',
        deadline: '',
        completed: false,
      },
    ]);
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
  const handleDeleteItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
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
      skill: skillId ? { skillId: parseInt(skillId) } : null,
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
      <>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="xl" />
        </div>
      </>
    );
  }

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Learning Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Plan Title" />
              <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label value="Expected Start Date" />
                <TextInput type="date" value={expectedStartDate} onChange={(e) => setExpectedStartDate(e.target.value)} />
              </div>
              <div>
                <Label value="Expected End Date" />
                <TextInput type="date" value={expectedEndDate} onChange={(e) => setExpectedEndDate(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="status" value="Status" />
              <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="skill" value="Skill" />
              <Select id="skill" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill.skillId} value={skill.skillId}>
                    {skill.skillName}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label value="Topics & Tasks" />
              {items.map((item, index) => (
              <div key={index} className="grid md:grid-cols-4 gap-4 my-2 items-center">
                <TextInput
                  placeholder="Topic"
                  value={item.topic}
                  onChange={(e) => handleItemChange(index, 'topic', e.target.value)}
                  required
                />
                <TextInput
                  placeholder="Resource (optional)"
                  value={item.resource}
                  onChange={(e) => handleItemChange(index, 'resource', e.target.value)}
                />
                <TextInput
                  type="date"
                  value={item.deadline}
                  onChange={(e) => handleItemChange(index, 'deadline', e.target.value)}
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
              <Button type="button" onClick={handleAddItem} className="mt-2" gradientDuoTone="purpleToBlue">
                + Add Task
              </Button>
            </div>

            <div className="flex justify-center">
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="w-52 text-lg font-bold"
            >
              Save Changes
            </Button>
          </div>
          </form>
        </Card>
      </section>
    </>
  );
};

export default EditLearningPlan;
