import React, { useState } from 'react';
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Select
} from 'flowbite-react';
import { MenuBar } from '../../components/shared/Navbar';
import { FooterComponent } from '../../components/shared/Footer';
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
  const [items, setItems] = useState([
    { topic: '', resource: '', deadline: '', completed: false },
  ]);

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
    <>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Learning Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Plan Title" />
              <TextInput
                id="title"
                type="text"
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
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label value="Expected Start Date" />
                <TextInput
                  type="date"
                  value={expectedStartDate}
                  onChange={(e) => setExpectedStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label value="Expected End Date" />
                <TextInput
                  type="date"
                  value={expectedEndDate}
                  onChange={(e) => setExpectedEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label value="Status" />
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </Select>
            </div>

            <div>
              <Label value="Post ID (optional)" />
              <TextInput
                type="text"
                value={postId}
                placeholder="Related Post ID"
                onChange={(e) => setPostId(e.target.value)}
              />
            </div>

            <div>
              <Label value="Topics & Tasks" />
              {items.map((item, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-3 my-2">
                  <TextInput
                    type="text"
                    placeholder={`Topic ${index + 1}`}
                    value={item.topic}
                    onChange={(e) => handleItemChange(index, 'topic', e.target.value)}
                    required
                  />
                  <TextInput
                    type="text"
                    placeholder="Resource (optional)"
                    value={item.resource}
                    onChange={(e) => handleItemChange(index, 'resource', e.target.value)}
                  />
                  <TextInput
                    type="date"
                    value={item.deadline}
                    onChange={(e) => handleItemChange(index, 'deadline', e.target.value)}
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddItem}
                className="mt-2"
                gradientDuoTone="purpleToBlue"
              >
                + Add Task
              </Button>
            </div>

            <div className="flex justify-center">
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="w-52 text-lg font-bold"
            >
              Submit Plan
            </Button>
          </div>
          </form>
        </Card>
      </section>
    </>
  );
};

export default CreateLearningPlan;
