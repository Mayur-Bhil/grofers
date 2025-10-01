import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import summuryapi from "../common/summuryApi.js"
import Axios from "../utils/useAxios.js"
import { addToCart, clearCart } from "../store/Cartslice.js";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError.js";
import toast from "react-hot-toast";
import { priceWithDisCount } from "../utils/DisCountCunter.js";
import { addAddress } from "../store/Address.slice.js";

// Create context with a meaningful default value
const GlobalContext = createContext({
    fetchCartData: () => {},
    updateQuntity: () => {},
    deleteCartItems: () => {},
    handleLogout: () => {},
    clearCartData: () => {},
    getCartItemCount: () => 0,
    fetchAddress: () => {},
    totalPrice: 0,
    totalQty: 0,
    notDiscountprice: 0,
    isLoading: false,
    cartItemsCount: 0
});

// Provider component
function GlobalContextProvider({ children }) {
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const [notDiscountprice, setnotDiscountPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const cartItems = useSelector((store) => store?.cart?.cart || []);
    const user = useSelector((store) => store?.user);

    const clearCartData = useCallback(() => {
        try {
            setTotalQty(0);
            setTotalPrice(0);
            setnotDiscountPrice(0);
            dispatch(clearCart());
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    }, [dispatch]);

    const fetchAddress = useCallback(async() => {
        const currentToken = localStorage.getItem("accessToken");
        if (!user?._id || !currentToken) return;

        try {
            const response = await Axios({
                ...summuryapi.getAddress
            });

            const {data: responseData} = response;
            if(responseData.success) {
                dispatch(addAddress(responseData.data));
            }
        } catch (error) {
            console.error("Address fetch error:", error);
            if (!(error.response?.status === 401 || error.response?.status === 403)) {
                const errorMessage = error.response?.data?.message?.trim() || error.message?.trim();
                if (errorMessage) {
                    AxiosToastError(error);
                }
            }
        }
    }, [dispatch, user?._id]);

    const fetchCartData = useCallback(async() => {
        const currentToken = localStorage.getItem("accessToken");
        if (!user?._id || !currentToken) {
            return;
        }
        
        try {
            setIsLoading(true);
            
            const response = await Axios({
                ...summuryapi.getCartDetails
            });
            
            const { data: responseData } = response;
            
            if (responseData.success && Array.isArray(responseData.data)) {
                // Ensure we're setting clean data
                const cleanCartData = responseData.data.filter(item => 
                    item && item.productId && item.quantity > 0
                );
                dispatch(addToCart(cleanCartData));
            }
        } catch (error) {
            console.error("Cart fetch error:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                clearCartData();
            } else {
                // Don't show error toast for cart fetch failures in background
                console.error("Failed to fetch cart data:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, user?._id, clearCartData]); 

    useEffect(() => {
        if (!Array.isArray(cartItems)) {
            setTotalQty(0);
            setTotalPrice(0);
            setnotDiscountPrice(0);
            return;
        }

        // Filter out invalid items first
        const validItems = cartItems.filter(item => 
            item && 
            item.productId && 
            item.quantity && 
            item.quantity > 0 &&
            item.productId.price
        );

        if (validItems.length === 0) {
            setTotalQty(0);
            setTotalPrice(0);
            setnotDiscountPrice(0);
            return;
        }

        let totalQuantity = 0;
        let calculatedTotalPrice = 0;
        let calculatedNotDiscountPrice = 0;

        validItems.forEach((item) => {
            const quantity = parseInt(item.quantity) || 0;
            const originalPrice = parseFloat(item.productId.price) || 0;
            const discount = parseFloat(item.productId.discount) || 0;
            
            totalQuantity += quantity;
            
            const priceAfterDiscount = discount > 0 ? 
                Number(priceWithDisCount(originalPrice, discount)) : 
                (item.productId.sellingPrice || originalPrice);
            
            calculatedTotalPrice += priceAfterDiscount * quantity;
            calculatedNotDiscountPrice += originalPrice * quantity;
        });

        // Batch state updates to prevent multiple re-renders
        setTotalQty(totalQuantity);
        setTotalPrice(calculatedTotalPrice);
        setnotDiscountPrice(calculatedNotDiscountPrice);
        
    }, [cartItems]);

    // Handle user authentication changes
    useEffect(() => {
        const currentToken = localStorage.getItem("accessToken");
        
        if (user?._id && currentToken) {
            fetchCartData();
            fetchAddress();
        } else if (!user?._id || !currentToken) {
            clearCartData();
        }
    }, [user?._id, fetchCartData, fetchAddress, clearCartData]);

    // Update quantity with better error handling
    const updateQuntity = useCallback(async(id, qty) => {
        const currentToken = localStorage.getItem("accessToken");
        if (!user?._id || !currentToken) {
            toast.error("Please login to update cart");
            return false;
        }

        if (qty < 0) {
            toast.error("Invalid quantity");
            return false;
        }
        
        try {
            const response = await Axios({
                ...summuryapi.updateQunatity,
                data: {
                    _id: id,
                    qty: qty,
                }
            });
            
            const {data: responseData} = response;

            if (responseData.success) {
                toast.success(responseData.message);
                // Refresh cart data immediately
                await fetchCartData();
                return true;
            } else {
                toast.error(responseData.message || "Failed to update cart");
                return false;
            }
        } catch (error) {
            console.error("Update quantity error:", error);
            AxiosToastError(error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                clearCartData();
            }
            return false;
        }
    }, [user?._id, fetchCartData, clearCartData]);

    // Delete cart items with better error handling
    const deleteCartItems = useCallback(async(cardId) => {
        const currentToken = localStorage.getItem("accessToken");
        if (!user?._id || !currentToken) {
            toast.error("Please login to delete cart items");
            return false;
        }
        
        try {
            const response = await Axios({
                ...summuryapi.deleteCartItem,
                data: {
                    _id: cardId
                }
            });
            
            const {data: responseData} = response;

            if (responseData.success) {
                toast.success(responseData.message);
                // Refresh cart data immediately
                await fetchCartData();
                return true;
            } else {
                toast.error(responseData.message || "Failed to delete item");
                return false;
            }
        } catch (error) {
            console.error("Delete cart item error:", error);
            AxiosToastError(error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                clearCartData();
            }
            return false;
        }
    }, [user?._id, fetchCartData, clearCartData]);

    // Logout function
    const handleLogout = useCallback(() => {
        localStorage.clear();
        clearCartData();
        toast.success("Logged out successfully");
    }, [clearCartData]);

    // Add a function to get actual cart count
    const getCartItemCount = useCallback(() => {
        if (!Array.isArray(cartItems)) return 0;
        return cartItems.filter(item => 
            item && 
            item.productId && 
            item.quantity && 
            item.quantity > 0
        ).length;
    }, [cartItems]);

    const contextValue = useMemo(() => ({
        fetchCartData,
        updateQuntity,
        deleteCartItems,
        handleLogout,
        clearCartData,
        getCartItemCount,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountprice,
        isLoading,
        cartItemsCount: getCartItemCount()
    }), [
        fetchCartData,
        updateQuntity, 
        deleteCartItems,
        handleLogout,
        clearCartData,
        getCartItemCount,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountprice,
        isLoading
    ]);

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

// Custom hook for using the context - moved inside the same file
const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalContextProvider');
    }
    return context;
};

// Single default export with named export for the hook
export default GlobalContextProvider;
export { useGlobalContext };