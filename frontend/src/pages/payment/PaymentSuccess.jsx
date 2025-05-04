import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaCheckCircle, FaReceipt, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Extract all data from URL query parameters
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      
      if (!sessionId) {
        setError('Invalid payment session');
        setLoading(false);
        return;
      }

      // Read data directly from URL params
      const details = {
        sessionId: sessionId,
        paymentStatus: params.get('paymentStatus') || 'paid',
        amountTotal: parseInt(params.get('amountTotal')) || 100,
        currency: params.get('currency') || 'usd',
        customerEmail: params.get('customerEmail') || 'Not available'
      };
      
      setPaymentDetails(details);
      
      // Show success toast
    //   toast.success('Payment successful! You now have Premium access.');
      
      // Update user context if needed (add premium status)
      // This depends on how you manage user state in your app
      
      setLoading(false);
    } catch (err) {
      console.error('Error processing payment details:', err);
      setError(`Failed to load payment details: ${err.message}`);
      setLoading(false);
    }
  }, [location]);

  // Format currency for display
  const formatCurrency = (amount, currency) => {
    if (!amount) return '$0.00';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.toLowerCase() || 'usd',
    });
    return formatter.format(amount / 100); // Stripe amounts are in cents
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Processing your payment...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait while we confirm your transaction.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600">Payment Error</h1>
          <p className="mt-3 text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-8 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
              className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"
            >
              <FaCheckCircle className="text-4xl text-green-500" />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-white">Payment Successful!</h1>
            <p className="mt-2 text-blue-100">
              Thank you for upgrading to Premium.
            </p>
          </div>
          
          {/* Payment details */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaReceipt className="mr-2" /> Payment Details
            </h2>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(paymentDetails?.amountTotal, paymentDetails?.currency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">
                  {paymentDetails?.customerEmail || "Not available"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {paymentDetails?.paymentStatus || "Completed"}
                </span>
              </div>
              
              {/* <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium text-gray-900 text-sm">
                  {paymentDetails?.sessionId || "Not available"}
                </span>
              </div> */}
            </div>
            
            {/* Benefits section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Premium Benefits Unlocked
              </h3>
              <ul className="space-y-2">
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unlimited skill connections</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Priority in search results</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-start"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Advanced analytics and insights</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex items-start"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Premium badge on your profile</span>
                </motion.li>
              </ul>
            </div>
          </div>
          
          {/* Footer actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              Return to Homepage
            </button>
            <button
              onClick={() => navigate('/account-settings')}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View Account <FaArrowRight className="ml-2" />
            </button>
          </div>
        </motion.div>
        
        {/* Support info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>If you have any questions, please contact our support team.</p>
          <p className="mt-1">support@skillhub.com</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;