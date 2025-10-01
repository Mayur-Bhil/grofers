import React from 'react'
import { useGlobalContext } from"../provider/global.provider.jsx"
import { IoCartSharp } from 'react-icons/io5';
import { PriceInruppees } from '../utils/DisplayPriceinRuppes';
import { Link } from 'react-router-dom';
import { FaCaretRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

const CartMobileLink = () => {
    const {totalPrice,totalQty} = useGlobalContext();
    const cartItems = useSelector((store)=>store?.cart?.cart);
  return (
    <>
    {
        cartItems[0] && <div className='bottom-4 sticky  p-2'>
            <div className='bg-green-500 rounded px-2 py-1 flex items-center justify-between text-neutral-50 text-sm lg:hidden'>
              <div className='flex items-center gap-4'>
                  <div className='p-2 bg-green-400 rounded w-fit'>
                    <IoCartSharp />
                  </div>
                  <div className='text-md'>
                    <p>{totalQty} items</p>
                    <p>{PriceInruppees(totalPrice)}</p>
                  </div>
              </div>

                <Link to={"/cart"} className='items-center flex gap-3'>
                            <span className='text-md'>View Cart</span>
                            <FaCaretRight/>
                    </Link>
            </div>
        </div>
    }
     
    </>
  )
}

export default CartMobileLink
    