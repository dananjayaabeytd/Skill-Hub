import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { RiCloseLine } from 'react-icons/ri';
import api from '../../services/api';
import toast from 'react-hot-toast';

const GlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Fetch all users initially
  // Fetch all users initially
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Add a check for token presence
        const token = localStorage.getItem('JWT_TOKEN');
        if (!token) {
          console.warn('No JWT token found in localStorage');
          // You might want to handle this case differently
          // Perhaps redirect to login or show a message
          return;
        }
        
        console.log('Fetching users with endpoint: /users/role-users');
        setIsLoading(true); // Set loading state
        
        // Fix: use the correct endpoint path that matches your backend controller
        const response = await api.get('/users/getusers');
        
        console.log('User response received:', response.status);
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        // More detailed error logging
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        setError(err?.response?.data?.message || 'Error fetching users');
        toast.error('Error fetching users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllUsers();
  }, []);

  // Handle search
useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsLoading(true);
      setIsResultsVisible(true);
      
      // Use a timeout to debounce the search
      const timer = setTimeout(() => {
        // Filter the already fetched users
        const results = users.filter(user => 
          user.userName?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // const results = users.filter(user => 
        //     user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //     user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        //   );
        
        setSearchResults(results.map(user => ({
          id: user.userId,
          name: user.userName,
          // Extract roleName from the role object
          role: user.role?.roleName || 'User',
          avatar: user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=random`
        })));
        
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsResultsVisible(false);
    }
  }, [searchQuery, users]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative z-50 w-full">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <motion.input
          whileFocus={{ boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.4)" }}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setIsResultsVisible(true)}
          placeholder="Search people..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isResultsVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-1 w-full bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
          >
            {/* Search Results */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                <>
                  {searchResults.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-6 px-4 text-center"
                    >
                      <MdOutlinePersonSearch className="mx-auto text-gray-400" size={32} />
                      <p className="mt-2 text-gray-500 text-sm">No results found for "{searchQuery}"</p>
                      <p className="text-xs text-gray-400">Try different keywords or check spelling</p>
                    </motion.div>
                  ) : (
                    <ul>
                      {searchResults.map((user) => (
                        <motion.li 
                          key={user.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                        >
                          <Link 
                            to={`/user-wall/${user.id}`} 
                            className="flex items-center px-4 py-3 hover:bg-gray-50"
                            onClick={() => {
                              setIsResultsVisible(false);
                              setSearchQuery('');
                            }}
                          >
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;