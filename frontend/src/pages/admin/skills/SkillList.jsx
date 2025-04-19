import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Card,
  TextInput,
  Label,
  Modal,
  Spinner,
  Badge,
  Textarea,
  Tooltip,
  Dropdown,
  Avatar
} from 'flowbite-react';
import {
  HiPlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineLightningBolt,
  HiOutlineAcademicCap
} from 'react-icons/hi';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SkillList = () => {
  // State management
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({ skillName: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortBy, setSortBy] = useState('skillName');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  // Get random color for skill avatar
  const getRandomColor = (skillName) => {
    const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'teal'];
    // Use the first character of the skill name to determine a consistent color
    const index = skillName.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 50 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch all skills from API
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
      toast.error('Error fetching skills');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!currentSkill.skillName.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      const response = await api.post('/skills', {
        skillName: currentSkill.skillName,
        description: currentSkill.description
      });
      
      setSkills([...skills, response.data]);
      toast.success('Skill added successfully');
      handleCloseModal();
    } catch (err) {
      console.error('Error adding skill:', err);
      toast.error('Failed to add skill');
    }
  };

  // Handle updating a skill
  const handleUpdateSkill = async () => {
    if (!currentSkill.skillName.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      const response = await api.put(`/skills/${currentSkill.skillId}`, {
        skillName: currentSkill.skillName,
        description: currentSkill.description
      });

      setSkills(skills.map(skill => 
        skill.skillId === currentSkill.skillId ? response.data : skill
      ));
      
      toast.success('Skill updated successfully');
      handleCloseModal();
    } catch (err) {
      console.error('Error updating skill:', err);
      toast.error('Failed to update skill');
    }
  };

  // Handle deleting a skill
  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}`);
      setSkills(skills.filter(skill => skill.skillId !== skillId));
      toast.success('Skill deleted successfully');
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting skill:', err);
      toast.error('Failed to delete skill');
    }
  };

  // Open modal for creating a new skill
  const openAddModal = () => {
    setCurrentSkill({ skillName: '', description: '' });
    setIsEditing(false);
    setOpenModal(true);
  };

  // Open modal for editing a skill
  const openEditModal = (skill) => {
    setCurrentSkill({ ...skill });
    setIsEditing(true);
    setOpenModal(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentSkill({ skillName: '', description: '' });
  };

  // Handle sort change
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort skills
  const filteredSkills = skills
    .filter(skill => 
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const sortValueA = a[sortBy] ? a[sortBy].toLowerCase() : '';
      const sortValueB = b[sortBy] ? b[sortBy].toLowerCase() : '';

      if (sortDirection === 'asc') {
        return sortValueA.localeCompare(sortValueB);
      } else {
        return sortValueB.localeCompare(sortValueA);
      }
    });

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-center rounded-lg mx-auto max-w-4xl my-8">
        <HiOutlineExclamation className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-lg font-medium mt-3 text-red-800">{error}</h2>
        <Button color="failure" className="mt-4" onClick={fetchSkills}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Skills Management
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Add, view, update, and delete skills in the system
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-2/3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiOutlineSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-3 pl-10 text-md border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search skills by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {/* Better Sort Buttons */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <button 
                  onClick={() => handleSort('skillName')}
                  className={`flex items-center justify-center px-4 py-2 rounded-l-lg ${
                    sortBy === 'skillName' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                  }`}
                  aria-label="Sort by name"
                >
                  <span className="mr-2">Name</span>
                  {sortBy === 'skillName' && (
                    sortDirection === 'asc' 
                      ? <HiOutlineSortAscending className="h-5 w-5" />
                      : <HiOutlineSortDescending className="h-5 w-5" />
                  )}
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button 
                  onClick={() => handleSort('description')}
                  className={`flex items-center justify-center px-4 py-2 rounded-r-lg ${
                    sortBy === 'description' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                  }`}
                  aria-label="Sort by description"
                >
                  <span className="mr-2">Description</span>
                  {sortBy === 'description' && (
                    sortDirection === 'asc' 
                      ? <HiOutlineSortAscending className="h-5 w-5" />
                      : <HiOutlineSortDescending className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <Button 
                gradientDuoTone="purpleToPink"
                className="w-full md:w-auto"
                onClick={openAddModal}
              >
                <HiPlus className="mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Skills Card Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color="purple" />
          </div>
        ) : (
          <>
            {filteredSkills.length === 0 ? (
              <motion.div 
                className="text-center py-16 bg-white rounded-lg shadow-md"
                variants={itemVariants}
              >
                <div className="p-4 bg-blue-50 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <HiOutlineLightningBolt className="text-blue-500 h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-1">No skills found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new skill'}
                </p>
                <Button 
                  gradientDuoTone="purpleToPink"
                  onClick={openAddModal}
                >
                  <HiPlus className="mr-2" />
                  Add First Skill
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                variants={containerVariants}
              >
                {filteredSkills.map((skill) => {
                  const skillColor = getRandomColor(skill.skillName);
                  
                  return (
                  <motion.div 
                    key={skill.skillId}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 h-full overflow-hidden border-0">
                      <div className="flex flex-col h-full">
                        {/* Skill Header with Avatar */}
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar 
                            rounded
                            size="md"
                            img={null}
                            placeholderInitials={skill.skillName.charAt(0).toUpperCase()}
                            color={skillColor}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-md font-bold tracking-tight text-gray-900 truncate">
                              {skill.skillName}
                            </h5>
                            <Badge color="gray" size="xs">
                              ID: {skill.skillId}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Skill Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {skill.description || "No description available for this skill."}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-auto border-t pt-3">
                          <Tooltip content="Edit skill">
                            <Button
                              size="xs"
                              color="light"
                              className="p-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(skill);
                              }}
                            >
                              <HiOutlinePencilAlt className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          
                          <Tooltip content="Delete skill">
                            <Button
                              size="xs"
                              color="failure"
                              className="p-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(skill);
                              }}
                            >
                              <HiOutlineTrash className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )})}
              </motion.div>
            )}
          </>
        )}

        {/* Results count */}
        {!loading && filteredSkills.length > 0 && (
          <motion.p 
            className="mt-6 text-center text-gray-600"
            variants={itemVariants}
          >
            Showing {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'}
          </motion.p>
        )}
      </motion.div>

      {/* Add/Edit Skill Modal */}
      <AnimatePresence>
        {openModal && (
          <Modal
            show={openModal}
            size="md"
            popup
            onClose={handleCloseModal}
            dismissible
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Modal.Header className="border-b border-gray-200 !p-6">
                <div className="flex items-center">
                  <HiOutlineAcademicCap className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-xl font-medium text-gray-900">
                    {isEditing ? 'Edit Skill' : 'Add New Skill'}
                  </h3>
                </div>
              </Modal.Header>
              <Modal.Body className="space-y-6 !p-6">
                <div>
                  <Label htmlFor="skillName" value="Skill Name" className="mb-2 block text-sm font-medium text-gray-900" />
                  <TextInput
                    id="skillName"
                    value={currentSkill.skillName}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, skillName: e.target.value })}
                    placeholder="Enter skill name"
                    required
                    autoFocus
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="description" value="Description" className="mb-2 block text-sm font-medium text-gray-900" />
                  <Textarea
                    id="description"
                    value={currentSkill.description || ''}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
                    placeholder="Enter skill description"
                    rows={5}
                    className="w-full"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="border-t border-gray-200 !p-6">
                <div className="flex justify-end gap-3 w-full">
                  <Button color="gray" onClick={handleCloseModal}>
                    <HiOutlineX className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                  <Button
                    gradientDuoTone="purpleToPink"
                    onClick={isEditing ? handleUpdateSkill : handleAddSkill}
                  >
                    <HiOutlineCheck className="mr-2 h-5 w-5" />
                    {isEditing ? 'Update Skill' : 'Add Skill'}
                  </Button>
                </div>
              </Modal.Footer>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <Modal
            show={!!confirmDelete}
            size="md"
            popup
            onClose={() => setConfirmDelete(null)}
            dismissible
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Modal.Header />
              <Modal.Body className="text-center p-6">
                <HiOutlineExclamation className="mx-auto mb-6 h-16 w-16 text-red-500" />
                <h3 className="mb-4 text-xl font-medium text-gray-900">
                  Delete Skill
                </h3>
                <p className="mb-6 text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{confirmDelete.skillName}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    color="gray"
                    onClick={() => setConfirmDelete(null)}
                  >
                    <HiOutlineX className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => handleDeleteSkill(confirmDelete.skillId)}
                  >
                    <HiOutlineTrash className="mr-2 h-5 w-5" />
                    Yes, delete skill
                  </Button>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillList;