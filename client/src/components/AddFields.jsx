import React from 'react';
import { IoClose } from 'react-icons/io5';

const AddFields = ({close,value,onChange,submit}) => {
    return (
        <section className='fixed top-0 bottom-0 right-0 left-0 opacity-95 z-50 bg-neutral-800 flex items-center justify-center p-4'>
                <div className='bg-white p-4 rounded w-full max-w-md gap-4'>
                   <div className='flex items-center justify-between gap-3'>
                        <h1 className='font-semibold'>Add new Field</h1>
                   <button  onClick={close} className='cursor-pointer ml-auto'><IoClose size={20}/></button>
                   </div>
                   <input
                        type="text"
                        placeholder='Enter Field name'
                        value={value}
                        onChange={onChange}
                        className='bg-blue-100 p-2 my-2 border-2 outline-none focus-within:border-amber-300 rounded w-full ' />
                        
                    <button onClick={submit} className=' cursor-pointer bg-green-300 px-4 py-2 rounded mx-auto w-fit block  hover:bg-green-600 hover:text-white border-2 hover:border-green-800'>Add Field</button>
                </div>
                
        </section>
    );
};

export default AddFields;