import React from 'react'

const CardLoading = () => {
  return (
    <div className='border  mx-auto p-3 grid gap-3 min-w-41 lg:max-w-52 lg:min-w-48 shadow-lg rounded animate-pulse'>
       <div className='min-h-14 lg:min-h-26 bg-zinc-100 rounded'>
            
       </div>
        <div className=' p-2 lg:p-3  bg-zinc-100 rounded w-17 lg:w-20'>
            
       </div>
       <div className='p-2 lg:p-3  bg-zinc-100 rounded'>
            
       </div>
       <div className='p-2 lg:p-3 bg-zinc-100 rounded w-16 lg:w-14'>

       </div>

       <div className='flex items-center justify-between gap-3'>
            <div className='p-2 lg:p-3 bg-zinc-100 rounded lg:w-20 w-14'>
                    
            </div>
            <div className='p-2 lg:p-3  bg-zinc-100 rounded lg:w-20 w-14'>
                
            </div>
       </div>
    </div>
  )
}

export default CardLoading
