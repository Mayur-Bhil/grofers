import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGlobalContext } from '../provider/global.provider';
import { clearCart } from '../store/Cartslice';
import Axios from '../utils/useAxios';
import toast from 'react-hot-toast';

const Success = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { clearCartData } = useGlobalContext();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const completeOrder = async () => {
            try {
                const orderId = searchParams.get('orderId');
                if (!orderId) {
                    throw new Error('Order ID not found');
                }

                // Update order status and clear cart in backend
                const response = await Axios.post(`/api/order/update-status/${orderId}`);

                if (response.data.success) {
                    // Clear cart in frontend
                    dispatch(clearCart());
                    await clearCartData();

                    toast.success('Payment successful! Order placed successfully', {
                        id: 'payment-success'
                    });

                    setTimeout(() => navigate('/orders'), 2000);
                } else {
                    throw new Error(response.data.message || 'Failed to complete order');
                }
            } catch (error) {
                console.error('Order completion error:', error);
                toast.error('Something went wrong', {
                    id: 'payment-error'
                });
                navigate('/checkout');
            } finally {
                setIsProcessing(false);
            }
        };

        completeOrder();
    }, [navigate, dispatch, clearCartData, searchParams]);

    // ... rest of your component code
};

export default Success;