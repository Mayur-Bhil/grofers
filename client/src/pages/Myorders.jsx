import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PriceInruppees } from "../utils/DisplayPriceinRuppes";
import Axios from "../utils/useAxios";
import summeryApis from "../common/summuryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { 
  setOrders, 
  setPagination, 
  setOrdersLoading, 
  cancelOrderInState 
} from "../store/Order.slice.js";

const MyOrders = () => {
  const user = useSelector((store) => store?.user);
  const pagination = useSelector((store) => store.orders.pagination);

  const orders = useSelector((store) => store.orders.orders);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const dispatch = useDispatch();
  // Fetch user orders
  const fetchOrders = useCallback(async (page = 1) => {
    if (!user?._id) return;

    try {
      dispatch(setOrdersLoading(true));
      const response = await Axios({
        ...summeryApis.getUserOrders,
        params: { page, limit: 10 }
      });

      if (response?.data?.success) {
        dispatch(setOrders(response.data.data));
        dispatch(setPagination(response.data.pagination));
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      AxiosToastError(error);
    } finally {
      dispatch(setOrdersLoading(false));
    }
  }, [user?._id, dispatch]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  // Get order details
  const getOrderDetails = async (orderId) => {
    try {
      const response = await Axios({
        ...summeryApis.getOrderDetails,
        url: summeryApis.getOrderDetails.url.replace(':orderId', orderId)
      });

      if (response?.data?.success) {
        setSelectedOrder(response.data.data);
        setShowOrderDetails(true);
      }
    } catch (error) {
      console.error("Order details error:", error);
      AxiosToastError(error);
    }
  };

  // Track order
  const trackOrder = async (orderId) => {
    try {
      const response = await Axios({
        ...summeryApis.trackOrder,
        url: summeryApis.trackOrder.url.replace(':orderId', orderId)
      });

      if (response?.data?.success) {
        setTrackingInfo(response.data.data);
        setShowTracking(true);
      }
    } catch (error) {
      console.error("Track order error:", error);
      AxiosToastError(error);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await Axios({
        ...summeryApis.cancelOrder,
        url: summeryApis.cancelOrder.url.replace(':orderId', orderId)
      });

      if (response?.data?.success) {
        toast.success("Order cancelled successfully");
        dispatch(cancelOrderInState(orderId)); // Update Redux state
        fetchOrders(pagination.currentPage); // Refresh current page
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      AxiosToastError(error);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED": return "bg-blue-100 text-blue-800";
      case "CONFIRMED": return "bg-yellow-100 text-yellow-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "REFUNDED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <span className="text-sm text-gray-600">
            {orders.length > 0 ? `${orders.length} orders found` : ''}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800">Order #{order.orderId}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Placed on {formatDate(order.createdAt)}</span>
                        <span>•</span>
                        <span>{order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        {PriceInruppees(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.list_items?.length} item{order.list_items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    {order.list_items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <img 
                          src={item.image || '/placeholder-image.jpg'} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="hidden lg:block">
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.list_items?.length > 3 && (
                      <span className="text-sm text-gray-500">+{order.list_items.length - 3} more</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => getOrderDetails(order.orderId)}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    
                    <button
                      onClick={() => trackOrder(order.orderId)}
                      className="px-4 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Track Order
                    </button>
                    
                    {(order.order_status === "PLACED" || order.order_status === "CONFIRMED") && (
                      <button
                        onClick={() => cancelOrder(order.orderId)}
                        className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => fetchOrders(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || isLoading}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => fetchOrders(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || isLoading}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order #{selectedOrder.orderId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.order_status)}`}>
                      {selectedOrder.order_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Placed on {formatDate(selectedOrder.createdAt)}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {selectedOrder.list_items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <img 
                          src={item.image || '/placeholder-image.jpg'} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium">{PriceInruppees(item.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{PriceInruppees(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Delivery Address</h3>
                  {selectedOrder.delivery_address && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p>{selectedOrder.delivery_address.address_line}</p>
                      <p>{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state}</p>
                      <p>{selectedOrder.delivery_address.country} - {selectedOrder.delivery_address.pincode}</p>
                      <p>Mobile: {selectedOrder.delivery_address.mobile}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{PriceInruppees(selectedOrder.subTotalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges:</span>
                      <span>{PriceInruppees(selectedOrder.totalAmount - selectedOrder.subTotalAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-green-600">{PriceInruppees(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showTracking && trackingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Track Order</h2>
                <button
                  onClick={() => setShowTracking(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Order #{trackingInfo.orderId}</p>
                <p className="text-sm text-gray-600">Last updated: {formatDate(trackingInfo.lastUpdated)}</p>
              </div>

              <div className="space-y-4">
                {trackingInfo.trackingSteps?.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                    {step.completed && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;