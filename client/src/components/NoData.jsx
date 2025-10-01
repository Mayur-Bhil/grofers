import React from 'react';
import noDataImage from "../assets/nothing here yet.webp"

const NoData = () => {
    return (
        <div className='flex-col flex items-center justify-center p-4'>
            <img src={noDataImage} alt={"no data"}
            className='w-36' />
        <p className='text-neutral-700'>No data Found</p>
        </div>
    );
};

export default NoData;