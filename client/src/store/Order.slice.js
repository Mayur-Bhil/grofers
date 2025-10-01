import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
    orders: [],
    currentOrder: null,
    isLoading: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNextPage: false,
        hasPrevPage: false
    }
};

export const OrdersSlice = createSlice({
    name: "orders",
    initialState: initialValue,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        
        addOrder: (state, action) => {
            state.orders.unshift(action.payload); // Add new order at the beginning
        },
        
        updateOrder: (state, action) => {
            const index = state.orders.findIndex(order => order._id === action.payload._id);
            if (index !== -1) {
                state.orders[index] = { ...state.orders[index], ...action.payload };
            }
        },
        
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        
        setOrdersLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        cancelOrderInState: (state, action) => {
            const orderId = action.payload;
            const order = state.orders.find(order => order.orderId === orderId);
            if (order) {
                order.order_status = "CANCELLED";
                order.payment_status = order.payment_method === "ONLINE" ? "REFUNDED" : "CANCELLED";
            }
        },
        
        clearOrders: (state) => {
            state.orders = [];
            state.currentOrder = null;
            state.pagination = initialValue.pagination;
        }
    }
});

export const { 
    setOrders, 
    addOrder, 
    updateOrder, 
    setCurrentOrder, 
    setPagination, 
    setOrdersLoading, 
    cancelOrderInState, 
    clearOrders 
} = OrdersSlice.actions;

export default OrdersSlice.reducer;