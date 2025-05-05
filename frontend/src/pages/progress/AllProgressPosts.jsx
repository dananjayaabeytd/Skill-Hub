import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, Badge, TextInput } from 'flowbite-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';

const AllProgressPosts = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/progress/all');
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch all progress posts');
      }
    };
    fetchAll();
  }, []);

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  });

  // Filter entries by search term
  // Filter and paginate
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      (entry.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (entry.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || entry.templateType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const chunks = chunkArray(paginatedEntries, 3); // 3 per row

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <motion.h2
        className="text-4xl font-extrabold mb-12 text-center text-gray-800"
        variants={fadeIn(0)}
        initial="hidden"
        animate="visible"
      >
        Community Progress Feed
      </motion.h2>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
         {['All', 'CERTIFICATE', 'MILESTONE', 'DAILY_LOG'].map((type) => (
           <button
             key={type}
             onClick={() => {
               setActiveFilter(type);
               setCurrentPage(1);
             }}
             className={`px-4 py-2 rounded-full text-sm font-medium border ${
               activeFilter === type
                 ? 'bg-blue-600 text-white shadow'
                 : 'bg-white text-gray-700 hover:bg-blue-50'
             }`}
           >
             {type === 'All' ? 'All Templates' : type.charAt(0) + type.slice(1).toLowerCase()}
           </button>
         ))}
       </div>

      {/* Search bar */}
      <div className="mb-10 flex justify-center">
         <div className="relative w-full max-w-md">
           <TextInput
             placeholder="Search by title or description..."
             value={searchTerm}
             onChange={(e) => {
               setSearchTerm(e.target.value);
               setCurrentPage(1);
             }}
             className="pl-10 rounded-lg shadow-md"
             icon={HiSearch}
           />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <motion.div
           className="text-center text-gray-500 mt-20"
          variants={fadeIn(0.1)}
          initial="hidden"
          animate="visible"
        >
          <img src="/images/no-results.png" alt="No posts" className="mx-auto mb-4 w-40 opacity-80" />
           <p className="text-lg">No progress posts match your search.</p>
         </motion.div>
      ) : (
 
        <>
        {chunks.map((chunk, chunkIndex) => (
          <motion.div
            key={chunkIndex}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={fadeIn(chunkIndex * 0.4)}
            initial="hidden"
            animate="visible"
          >
            {chunk.map((entry) => (
              <motion.div
                key={entry.id}
                variants={fadeIn(0.1)}
                initial="hidden"
                animate="visible"
              >
                <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300 rounded-2xl p-6 bg-white h-full">
                  <div className="flex flex-col gap-3 h-full justify-between">
                    {/* Optional media thumbnail */}
                    {entry.mediaUrls?.length > 0 && (
                      <img
                        src={entry.mediaUrls[0]}
                        alt="Progress"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                      <p className="text-gray-700 text-sm mt-1">{entry.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge color="blue">{entry.templateType}</Badge>
                      <Badge color="gray">{format(new Date(entry.date), 'PPP')}</Badge>
                    </div>

                    <div className="text-sm text-gray-500 mt-4">
                      View followed plan:{' '}
                      <span
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                        onClick={() => window.location.href = `/plans/view/${entry.planId}`}
                      >
                        #{entry.planId}
                      </span>{' '}
                      | User ID: {entry.userId}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ))}

        {/* Pagination controls */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage * postsPerPage >= filteredEntries.length}
          >
            Next
          </button>
        </div>
      </>
      )}
    </motion.section>
  );
};

export default AllProgressPosts;


