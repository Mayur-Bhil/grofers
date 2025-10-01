import React, { useState } from 'react'
import { PriceInruppees } from '../utils/DisplayPriceinRuppes'
import { Link } from 'react-router-dom'
import { validUrl } from '../utils/validUrlConvert'
import { priceWithDisCount } from '../utils/DisCountCunter';


import AddtoCart from './AddtoCart.jsx';

const CartProduct = ({data}) => {
     const url = `/product/${validUrl(data.name)}-${data._id}`;
     
     if (!data) {
          return null;
     }

     return (
          <div className='border mx-auto p-2 grid lg:min-h-58 min-h-44 gap-0 lg:gap-1 lg:max-w-56 min-w-41 lg:shadow-lg bg-white rounded'>
               <Link to={url} className='contents'> {/* Move Link inside and use contents class */}
                    <div className='min-h-20 max-h-32 rounded'>
                         <img 
                              src={data.Image?.[0] || '/placeholder-image.jpg'} // Add fallback image and safe access
                              alt={data.name || 'Product image'} // Add alt attribute
                              className='w-full h-full object-scale-down'
                         />
                    </div>
                    <div className='bg-green-100 text-green-600 w-fit p-[0.5px] px-2 rounded text-sm'>
                         10 min
                    </div>
                    <div className='lg:p-2 p-1 text-sm lg:font-medium text-ellipsis line-clamp-2 rounded'>
                         {data.name}
                    </div>
                    <div className='w-fit lg:p-1 text-sm p-1 flex gap-2'>
                         {data.unit}
                         <span className='flex gap-2'>
                              {Boolean(data.discount) && (
                                   <>
                                        <p className='text-green-600 text-sm'>{data.discount}% off</p> {/* Fixed color: was text-green-300 */}
                                        <p className='line-through text-sm'>{PriceInruppees(data.price)}</p>
                                   </>
                              )}
                         </span>
                    </div>
               </Link>

               <div className='flex justify-between lg:gap-3 gap-2'>
                    <div className='p-1 lg:p-3'>
                         {PriceInruppees(priceWithDisCount(data.price, data.discount))}
                    </div>
                    <div className='p-1 lg:p-2 flex items-center'>
                         {
                              data.stock === 0 ? ( // Use strict equality
                                   <p className='text-sm text-red-500'>Out of stock</p> // Capitalized
                              ) : (
                                   <AddtoCart data={data}/>
                              )
                         }
                    </div>    
               </div>
          </div>
     )
};

export default CartProduct