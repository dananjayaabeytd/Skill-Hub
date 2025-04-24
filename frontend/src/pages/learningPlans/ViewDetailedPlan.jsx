import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Button,
  Badge,
  TextInput,
  Label,
  Spinner,
} from 'flowbite-react';
import { MenuBar } from '../../components/shared/Navbar';
import { FooterComponent } from '../../components/shared/Footer';
import { format, parseISO } from 'date-fns';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ViewDetailedPlan = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedFields, setEditedFields] = useState({
    topic: '',
    deadline: '',
    resource: '',
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/learning-plans/${id}`);
        setPlan(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setEditedFields({
      topic: item.topic,
      deadline: item.deadline || '',
      resource: item.resource || '',
    });
  };

  const handleFieldChange = (field, value) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateItem = async (itemId) => {
    try {
      const res = await api.put(`/learning-plans/items/${itemId}`, editedFields);
      const updatedItems = plan.items.map((item) =>
        item.id === itemId ? res.data : item
      );
      setPlan({ ...plan, items: updatedItems });
      setEditingItemId(null);
      toast.success('Item updated');
    } catch (err) {
      toast.error('Failed to update item');
    }
  };

  const handleMarkComplete = async (itemId) => {
    try {
      const res = await api.put(`/learning-plans/items/${itemId}/complete`);
      const updatedItems = plan.items.map((item) =>
        item.id === itemId ? res.data : item
      );
      setPlan({ ...plan, items: updatedItems });
      toast.success('Marked as complete');
    } catch (err) {
      toast.error('Failed to mark complete');
    }
  };

  if (loading) {
    return (
      <>
        <MenuBar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="xl" />
        </div>
        <FooterComponent />
      </>
    );
  }

  if (!plan) {
    return (
      <>
        <div className="text-center mt-20 text-red-600 text-xl">
          Learning Plan not found.
        </div>
      </>
    );
  }

  return (
    <>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <Card>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">{plan.title}</h2>
          <p className="text-gray-600 mb-4">{plan.description}</p>

          <div className="flex flex-wrap gap-4 text-sm mb-6">
            {plan.expectedStartDate && (
              <Badge color="gray">Start: {plan.expectedStartDate}</Badge>
            )}
            {plan.expectedEndDate && (
              <Badge color="gray">End: {plan.expectedEndDate}</Badge>
            )}
            {plan.expectedDurationDays !== null && (
              <Badge color="gray">Duration: {plan.expectedDurationDays} days</Badge>
            )}
            <Badge color="info">Status: {plan.status}</Badge>
            <Badge color="success">Progress: {plan.completionPercentage}%</Badge>
          </div>

          <div className="space-y-4">
            {plan.items && plan.items.length > 0 ? (
              plan.items.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    {editingItemId === item.id ? (
                      <>
                        <Label value="Topic" />
                        <TextInput
                          value={editedFields.topic}
                          onChange={(e) => handleFieldChange('topic', e.target.value)}
                        />
                        <Label value="Resource (optional)" />
                        <TextInput
                          value={editedFields.resource}
                          onChange={(e) => handleFieldChange('resource', e.target.value)}
                        />
                        <Label value="Deadline" />
                        <TextInput
                          type="date"
                          value={editedFields.deadline}
                          onChange={(e) => handleFieldChange('deadline', e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium">{item.topic}</p>
                        {item.resource && (
                          <p className="text-sm text-gray-500">Resource: {item.resource}</p>
                        )}
                        {item.deadline && (
                          <p className="text-sm text-gray-500">
                            Deadline: {format(parseISO(item.deadline), 'yyyy-MM-dd')}
                          </p>
                        )}
                        <Badge color={item.completed ? 'success' : 'warning'}>
                          {item.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    {editingItemId === item.id ? (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleUpdateItem(item.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button size="sm" color="light" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                    )}
                    {!item.completed && (
                      <Button
                        size="sm"
                        gradientDuoTone="purpleToBlue"
                        onClick={() => handleMarkComplete(item.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in this plan.</p>
            )}
          </div>
        </Card>
      </section>
    </>
  );
};

export default ViewDetailedPlan;
