import React from 'react';

const Loading = () => {
    return (
        <div className='flex items-center justify-center p-4'>
                <div className="flex items-center justify-center">
                        {/* Simple spinning circle */}
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                 </div>
            </div>
    );
};

export default Loading;