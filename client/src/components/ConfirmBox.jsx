import React from 'react';
import { IoMdClose } from "react-icons/io";
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';

const ConfirmBox = ({cancel,confirm,close,message}) => {
   
    return (
        <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 opacity-85 p-4 flex justify-center items-center'>
               <div className='bg-white w-full max-w-md p-4 rounded'>
                    <div className='flex justify-between gap-3'>
                            <h1 className='font-semibold'>Delete Category</h1>
                            <button
                                 onClick={close}>
                                 <IoMdClose size={25} 
                                 className='cursor-pointer'
                                 />
                                 
                            </button>
                    </div>
                    <div>
                            <p className='my-4 '>{message}</p>
                            <div className='w-fit flex items-center  ml-auto gap-3'>
                                <button 
                                    onClick={cancel}
                                    className='px-3 py-1 rounded-sm border cursor-cursor-pointer border-red-400 text-red-600 hover:text-white hover:bg-red-700'>
                                    cancel
                                </button>
                                <button 
                                onClick={confirm}
                                className='px-3 py-1 rounded-sm border  cursor-pointer border-green-400 text-green-600 hover:text-white hover:bg-green-700 '>
                                    confirm
                                </button>
                            </div>
                    </div>
               </div>
        </div>
    );
};

export default ConfirmBox;