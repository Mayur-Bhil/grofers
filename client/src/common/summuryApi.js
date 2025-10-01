
export const BASE_URL = import.meta.env.VITE_BASE_URI   
const summeryApis = {
    register:{
        url:'/api/user/register',
        method:'POST'
    },
    login:{
        url:'/api/user/login',
        method:'POST'
    },
    forgot_password:{
        url:'/api/user/forgot-password',
        method:"POST"
    },
    verify_Otp:{
        url:'/api/user/verify-otp',
        method:"PUT"
    },
    reset_password:{
        url:'/api/user/reset-password',
        method:"PUT"
        
    },
    referesh_Token:{
        url:"/api/user/refresh-token",
        method:"POST"
    },
    userDetails:{
        url:"/api/user/user-details",
        method:"GET"
    },
    logout:{
        url:"/api/user/logout",
        method:"GET"
    },
    UploadAvatar:{
        url:"/api/user/upload-avatar",
        method:"PUT"
    },
    updateUser:{
        url:"/api/user/update-user",
        method:"PUT"
    },
    addCategory:{
        url:"/api/category/add-category",
        method:"POST"
    },
    uploadImage:{
        url:"/api/file/upload",
        method:"POST"
    },
    getCategory:{
        url:"/api/category/get",
        method:"GET"
    },
    UpdateCategory:{
        url:"/api/category/update",
        method:"PUT"
    },
    deleteCcategory:{
        url:"/api/category/delete",
        method:"DELETE"
    },
    createSubcategory:{
        url: "/api/sub-category/create",
        method: "POST",
    },
    getsubCategory:{
        url:"/api/sub-category/get",
        method:"POST"
    },
    updateSubCategory:{
        url:"/api/sub-category/update",
        method:"PUT"
    },
    deleteSubCategory:{
        url:"/api/sub-category/delete",
        method:"DELETE"
    },
    createNewProduct:{
        url:"/api/product/create",
        method:"POST"
    },
    getProduct:{
        url:'/api/product/get',
        method:"POST"
    },
    getProductByCategory :{
        url:'/api/product/get-product-by-category',
        method:"POST"
    },
     getProductByCategoryandSubcategory :{
        url:'/api/product/get-product-by-category-and-subcategory',
        method:"POST"
    },
    getProdctDetails:{
        url:"/api/product/get-product-details",
        method:"POST"
    },
    updateProductDetails:{
        url:"/api/product/update-product-details",
        method:"PUT"
    },deleteProduct:{
        url:"/api/product/delete-product",
        method:"delete"
    },searchProducts :{
        url:"/api/product/search-product",
        method:"POST"
    },
    addTocart:{
        url:"/api/cart/create",
        method:"POST"
    },
    getCartDetails:{
        url:"/api/cart/get",
        method:"GET"
    },
    updateQunatity:{
        url:"/api/cart/update-qty",
        method:"PUT"
    },
    deleteCartItem:{
        url:"/api/cart/delete-cart-item",
        method:"DELETE"
    },
    createAddress:{
        url:"/api/address/create",
        method:"POST"
    },
    getAddress:{
        url:"/api/address/get",
        method:"GET"
    },
    updateAddress:{
        url:"/api/address/update",
        method:"PUT"
    },
    dissableAddress:{
        url:"/api/address/dissable",
        method:"DELETE"
    },
    cashondeliery:{
        url:"/api/order/cash-on-delivery",
        method:"POST"
    },
    payment_url:{
        url:"/api/order/checkout",
        method:"POST"
    },
    clearCart: {
        url: '/api/cart/clear', // Add the proper endpoint
        method: 'POST'
    },
    getUserOrders: {
        url: "/api/orders/user",
        method: "get"
    },
    
    // Get specific order details
    getOrderDetails: {
        url: "/api/orders/:orderId",
        method: "get"
    },
    
    // Track order status
    trackOrder: {
        url: "/api/orders/track/:orderId", 
        method: "get"
    },
    
    // Cancel order
    cancelOrder: {
        url: "/api/orders/cancel/:orderId",
        method: "put"
    },
    
    // Update order status (for payment completion)
    updateOrderStatus: {
        url: "/api/orders/update/:orderId",
        method: "put"
    }
}

export default summeryApis;