import React, { useMemo, useCallback } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/global.provider'
import { PriceInruppees } from '../utils/DisplayPriceinRuppes'
import { FaCaretRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import AddtoCart from './AddtoCart'
import { priceWithDisCount } from '../utils/DisCountCunter'
import toast from 'react-hot-toast'

const DisplayCartItems = ({ close }) => {
  // Get context values
  const { notDiscountprice, totalPrice, totalQty, isLoading, cartItemsCount } = useGlobalContext();
  const user = useSelector(store => store.user);
  const navigate = useNavigate();
  
  // Get cart items from Redux store - single source of truth
  const cartItems = useSelector((store) => store?.cart?.cart || []);

  const redirectToCheckOut = () => {
    if (user?._id) {
      navigate("/checkout");
      close();
      return;
    }
    toast.error("Please Login");
  };

  // Memoize the savings calculation
  const savings = useMemo(() => {
    if (!notDiscountprice || !totalPrice) return 0;
    return notDiscountprice - totalPrice;
  }, [notDiscountprice, totalPrice]);

  // Filter out invalid cart items and memoize
  const validCartItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];
    return cartItems.filter(item => 
      item && 
      item.productId && 
      item.quantity && 
      item.quantity > 0 &&
      item.productId.price
    );
  }, [cartItems]);

  // Memoize image error handler
  const handleImageError = useCallback((e, imageUrl) => {
    console.log('Image failed to load:', imageUrl);
    e.target.style.display = 'none';
  }, []);

  // Memoize close handler
  const handleClose = useCallback(() => {
    if (close) close();
  }, [close]);

  // Show loading state
  if (isLoading && validCartItems.length === 0) {
    return (
      <section className='fixed inset-0 bg-neutral-800 opacity-80 flex items-center justify-center z-50'>
        <div className='bg-white w-full max-w-sm h-screen ml-auto flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Loading cart...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='fixed inset-0 bg-neutral-800 opacity-95 flex items-center justify-center z-50'>
      <div className='bg-white w-full max-w-sm h-screen ml-auto flex flex-col'>
        {/* Header - Fixed height */}
        <div className='flex items-center justify-between p-3 shadow-md flex-shrink-0'>
          <h1 className='font-semibold'>
            Cart ({cartItemsCount} {cartItemsCount === 1 ? 'type' : 'types'}, {totalQty} {totalQty === 1 ? 'item' : 'items'})
          </h1>
          
          {/* Mobile close button */}
          <Link to="/" onClick={handleClose} className='lg:hidden'>
            <IoClose size={25} />
          </Link>

          {/* Desktop close button */}
          <button 
            onClick={handleClose}
            className='hidden lg:block hover:bg-gray-100 rounded-full p-1 transition-colors'
          >
            <IoClose size={25} />
          </button>
        </div>

        {/* Content - Flexible height */}
        <div className='flex-1 bg-blue-50 flex flex-col gap-4 p-2 overflow-hidden'>
          {/* Savings display */}
          {savings > 0 && (
            <div className='flex items-center p-2 bg-blue-200 text-blue-500 rounded-full px-4 py-2 justify-between flex-shrink-0'>
              <p>Your total savings</p>
              <p className='font-semibold'>{PriceInruppees(savings)}</p>
            </div>
          )}

          {/* Cart items container - Scrollable */}
          <div className='bg-white rounded-lg p-2 flex-1 overflow-auto min-h-0'>
            {validCartItems.length > 0 ? (
              <div className='space-y-3'>
                {validCartItems.map((item, index) => {
                  const product = item?.productId;
                  const quantity = parseInt(item?.quantity) || 1;
                  
                  // Calculate prices safely
                  const originalPrice = parseFloat(product?.price) || 0;
                  const discount = parseFloat(product?.discount) || 0;
                  const discountedPrice = discount > 0 ? 
                    Number(priceWithDisCount(originalPrice, discount)) : 
                    (parseFloat(product?.sellingPrice) || originalPrice);
                  
                  return (
                    <div 
                      key={`${product?._id || 'item'}-${index}`} 
                      className='flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow'
                    >
                      {/* Image container */}
                      <div className='w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center'>
                        {product?.Image && product.Image[0] ? (
                          <img 
                            src={product.Image[0]} 
                            alt={product?.name || 'Product'}
                            className='w-full h-full object-cover'
                            onError={(e) => handleImageError(e, product.Image[0])}
                            loading="lazy"
                          />
                        ) : (
                          <div className='text-gray-400 text-xs text-center p-1'>
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-sm text-gray-900 truncate mb-1'>
                          {product?.name || 'Unknown Product'}
                        </h3>
                        
                        {/* Price section */}
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-green-600 font-semibold text-sm'>
                            {PriceInruppees(discountedPrice)}
                          </span>
                          {discount > 0 && originalPrice > discountedPrice && (
                            <>
                              <span className='text-gray-500 line-through text-xs'>
                                {PriceInruppees(originalPrice)}
                              </span>
                              <span className='text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded'>
                                {discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* Quantity controls */}
                        <div className='flex items-center justify-between'>
                          <div className='flex-shrink-0'>
                            <AddtoCart data={product} />
                          </div>
                          
                          {/* Item total */}
                          <div className='text-right'>
                            <p className='text-xs text-gray-500 mb-1'>
                              Qty: {quantity}
                            </p>
                            <p className='text-sm font-semibold text-gray-900'>
                              {PriceInruppees(discountedPrice * quantity)}
                            </p>
                            {discount > 0 && (
                              <p className='text-xs text-green-600'>
                                Saved: {PriceInruppees((originalPrice - discountedPrice) * quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center text-gray-500'>
                  <div className='text-4xl mb-4'>🛒</div>
                  <p className='font-medium text-lg mb-2'>Your cart is empty</p>
                  <p className='text-sm text-gray-400 mb-6'>Add some items to get started</p>
                  <Link 
                    className='inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors duration-200' 
                    to="/"
                    onClick={close}
                  >
                    Back to Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary - only show if there are items */}
        {validCartItems.length > 0 && (
          <div className='p-2 flex-shrink-0'>
            {/* Bill Details */}
            <div className='bg-white rounded-lg p-3 border border-gray-200 mb-3'>
              <h3 className='font-semibold text-gray-800 mb-3 text-sm'>Bill Details</h3>
              
              <div className='space-y-2 text-sm'>
                {/* Items Total */}
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>
                    Items Total ({totalQty} {totalQty === 1 ? 'item' : 'items'})
                  </span>
                  <span className='font-medium'>{PriceInruppees(totalPrice || 0)}</span>
                </div>
                
                {/* Delivery Charges */}
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Delivery Charges</span>
                  <span className={`font-medium ${(totalPrice || 0) >= 500 ? 'text-green-600' : 'text-gray-800'}`}>
                    {(totalPrice || 0) >= 500 ? 'FREE' : PriceInruppees(40)}
                  </span>
                </div>
                
                {/* Free delivery message */}
                {(totalPrice || 0) < 500 && (
                  <p className='text-xs text-orange-600 bg-orange-50 p-2 rounded'>
                    Add {PriceInruppees(500 - (totalPrice || 0))} more for FREE delivery
                  </p>
                )}
                
                {/* Savings */}
                {savings > 0 && (
                  <div className='flex justify-between items-center text-green-600'>
                    <span>Total Savings</span>
                    <span className='font-medium'>-{PriceInruppees(savings)}</span>
                  </div>
                )}
                
                {/* Divider */}
                <hr className='border-gray-200 my-2' />
                
                {/* Grand Total */}
                <div className='flex justify-between items-center font-semibold text-base'>
                  <span className='text-gray-800'>Grand Total</span>
                  <span className='text-green-600'>
                    {PriceInruppees((totalPrice || 0) + ((totalPrice || 0) >= 500 ? 0 : 40))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proceed Button - Fixed at bottom */}
        {validCartItems.length > 0 && (
          <div className='p-2 pt-0 flex-shrink-0'>
            <div 
              onClick={redirectToCheckOut}
              className='bg-green-600 text-white p-3 px-4 font-bold rounded flex justify-between items-center gap-4 hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50'
            >
              <div>
                <p className='text-sm opacity-90'>Total</p>
                <h3 className='text-lg'>
                  {PriceInruppees((totalPrice || 0) + ((totalPrice || 0) >= 500 ? 0 : 40))}
                </h3>
              </div>
             
              <div className='flex items-center gap-1 bg-opacity-20 px-4 py-2 rounded hover:bg-opacity-30 transition-all'>
                <span>Proceed</span>
                <FaCaretRight />
              </div>
            </div>
          </div>
        )}
      </div>  
    </section>
  );
};

export default React.memo(DisplayCartItems);