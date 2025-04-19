import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <section className="max-w-lg mx-auto">
          <div className="mb-8">
            {/* Replace "class" with "className" in the h1 tag */}
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              404
            </h1>
            <p className="text-2xl font-medium text-gray-700 mb-6">Page not found</p>
            <p className="text-gray-500 mb-8">Sorry, we couldn't find the page you're looking for.</p>
            
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Go back home
            </Link>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              If you believe this is a mistake, please contact our support team.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default NotFound;