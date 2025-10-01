import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment was cancelled or failed');

    // Redirect back to checkout after 2 seconds
    const timer = setTimeout(() => {
      navigate('/checkout');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">Your payment was not completed.</p>
        <p className="text-sm text-gray-500">Redirecting back to checkout...</p>
      </div>
    </div>
  );
};

export default Cancel;