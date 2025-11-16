import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/global.provider';
import summeryApis from '../common/summuryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/useAxios';
import { useSelector } from 'react-redux';
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import isAdmin from '../utils/isAdmin';

const AddtoCart = ({data}) => {
        const [loading,setLoading] = useState(false); 
        const { fetchCartData ,updateQuntity,deleteCartItems} = useGlobalContext();
        const cartItems = useSelector((store) => store?.cart?.cart || []);
        const user = useSelector((store) => store.user);
     //    console.log("Cart-Items",cartItems );
        const [isAvailableCart,setUSeAvailableCart] = useState(false);
        const [qty,setQty] = useState(0);
        const [cartitemDetails,setCartItemDetails] = useState();
     
     const handleAddToCart = async(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          setLoading(true);
          
          try {
               const response = await Axios({
                    ...summeryApis.addTocart,
                    data: {
                         productId: data?._id
                    }
               })
               const {data: responseData} = response;

               if(responseData.success){
                    toast.success(responseData.message)
                     fetchCartData();
               }    
          } catch (error) {
               AxiosToastError(error);
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
    const checkCartItems = cartItems.some((item) =>item.productId._id === data._id);
    setUSeAvailableCart(checkCartItems);
    
    if (checkCartItems) {
        const product = cartItems.find(item => item.productId._id === data._id);
     //    console.log("Product quantity", product);
        
        if (product && product.quantity !== undefined) {
            setQty(product.quantity);
           setCartItemDetails(product)
        }
    } else {
        setQty(0); 
    }
    
     }, [data, cartItems])

     const increseQty = (e)=>{
          e.preventDefault();
          e.stopPropagation();

          updateQuntity(cartitemDetails?._id,qty+1);
     }
     
     const decreseQty = (e)=>{
          e.preventDefault();
          e.stopPropagation();
          if(qty == 1){
               deleteCartItems(cartitemDetails?._id)
          }else{
               updateQuntity(cartitemDetails?._id,qty-1);
          }
     }

     // Don't render anything if user is admin
     if(isAdmin(user.role)){
          return null;
     }
     
     return (
    <div className='w-full max-w-[150px]'>
     {
          isAvailableCart ? (
               <div className='flex items-center justify-between bg-gray-100 rounded-full gap-4 '>
                    <button className='bg-green-600 hover-bg-green-700 text-white flex items-center justify-center flex-1 p-1 rounded-full font-semibold hover:scale-90 transition-all cursor-pointer' onClick={decreseQty}>
                              <FaMinus size={12} />
                    </button>
                    <p className='flex-1 text-center font-semibold w-full'>{qty}</p>
                    <button className='bg-green-600 flex-1 hover-bg-green-700 flex items-center justify-center text-white p-1 rounded-full font-semibold hover:scale-90 transition-all cursor-pointer' onClick={increseQty}><FaPlus  size={12}/></button>
               </div>
          ):(
               <button
                         className={`bg-green-400 cursor-pointer hover:bg-green-600 text-white px-4 py-1 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                         onClick={handleAddToCart}
                         disabled={loading}
                         >
                                        {loading ? "Adding": 'Add'}
               </button>
          )
     }
      
    </div>
  )
}

export default AddtoCart;