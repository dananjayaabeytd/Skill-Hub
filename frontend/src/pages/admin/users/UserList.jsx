import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/api.js';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, 
  Spinner, 
  Pagination, 
  Badge, 
  TextInput, 
  Dropdown,
  Button,
  Avatar
} from 'flowbite-react';
import { 
  HiOutlineSearch, 
  HiOutlineMail, 
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineAdjustments,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineFilter
} from 'react-icons/hi';
import Errors from '../../../components/Error.jsx';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const itemsPerPage = 6;
  const navigate = useNavigate();

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
      transition: { type: "spring", stiffness: 100 }
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/getusers');
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message || 'Error fetching users');
        toast.error('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <Badge color="success" className="w-24">{status}</Badge>;
    } else {
      return <Badge color="gray" className="w-24">{status}</Badge>;
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Prepare data with filtering, sorting and pagination
  const filteredUsers = users
    .map(item => ({
      id: item.userId,
      username: item.userName,
      email: item.email,
      created: moment(item.createdDate).format('MMMM DD, YYYY, hh:mm A'),
      status: item.enabled ? 'Active' : 'Inactive',
      avatar: item.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName)}&background=random`
    }))
    .filter(user => {
      // Apply search filter
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Errors message={error} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="p-6 bg-gray-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">User Management</h1>
        <p className="text-gray-600 text-center mb-8">View and manage all users in the system</p>
      </motion.div>
      
      {/* Filters and Search */}
      <motion.div 
        variants={itemVariants}
        className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <HiOutlineSearch className="text-gray-500" />
          </div>
          <TextInput
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Dropdown
            label={
              <div className="flex items-center gap-2">
                <HiOutlineFilter />
                <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
              </div>
            }
            dismissOnClick={true}
            color="light"
          >
            <Dropdown.Item onClick={() => setStatusFilter('all')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter('active')}>Active</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter('inactive')}>Inactive</Dropdown.Item>
          </Dropdown>
          
          <Button color="light" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setSortField('username');
            setSortDirection('asc');
          }}>
            <HiOutlineAdjustments className="mr-2" />
            Reset
          </Button>
        </div>
      </motion.div>
      
      {/* Users Table */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center h-72">
            <Spinner size="xl" color="info" />
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-72">
            <HiOutlineUser className="text-gray-400 text-5xl mb-3" />
            <p className="text-gray-500">No users found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell 
                    onClick={() => handleSort('username')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>Username</span>
                      {sortField === 'username' && (
                        <HiOutlineChevronDown className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell 
                    onClick={() => handleSort('email')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>Email</span>
                      {sortField === 'email' && (
                        <HiOutlineChevronDown className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell 
                    onClick={() => handleSort('created')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>Created At</span>
                      {sortField === 'created' && (
                        <HiOutlineChevronDown className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell 
                    onClick={() => handleSort('status')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <HiOutlineChevronDown className={`ml-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Actions</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {displayedUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      className="bg-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <Avatar img={user.avatar} rounded size="sm" />
                          {user.username}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <HiOutlineMail className="text-gray-500" />
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar className="text-gray-500" />
                          <span className="text-gray-600">{user.created}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(user.status)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2 justify-end">
                          <Button size="xs" color="info" onClick={() => handleViewUser(user.id)}>
                            <HiOutlineEye className="mr-2" />
                            View
                          </Button>
                          <Dropdown
                            label=""
                            icon={HiOutlineAdjustments}
                            arrowIcon={false}
                            size="xs"
                            color="light"
                          >
                            <Dropdown.Item icon={HiOutlinePencilAlt}>Edit</Dropdown.Item>
                            <Dropdown.Item icon={HiOutlineTrash} className="text-red-600">Delete</Dropdown.Item>
                          </Dropdown>
                        </div>
                      </Table.Cell>
                    </motion.tr>
                  ))}
                </Table.Body>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{Math.min(filteredUsers.length, 1 + (currentPage - 1) * itemsPerPage)}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
              </p>
              <div className="flex space-x-2">
                <Pagination
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                  showIcons
                  totalPages={totalPages}
                />
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserList;