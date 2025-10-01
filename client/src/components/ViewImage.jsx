import React from 'react';
import { IoClose } from 'react-icons/io5';

const ViewImage = ({url,close}) => {
    return (
        <div className='fixed top-0 right-0 left-0 bottom-0 bg-neutral-800 opacity-95 flex justify-center items-center z-50 p-16'>
            <div className='w-full max-w-md max-h-[75vh] p-4 bg-white'>
                <button className='w-fit ml-auto block cursor-pointer' onClick={close}>
                    <IoClose size={25}/>
                </button>
                <img src={url} alt="view" className='w-full h-full object-scale-down cursor-pointer' />
            </div>
        </div>
    );
};

export default ViewImage;