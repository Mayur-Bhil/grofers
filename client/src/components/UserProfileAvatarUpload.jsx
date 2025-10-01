import React, { useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { setUserAvatar } from '../store/userSclice';
import { IoClose } from "react-icons/io5";

const UserProfileAvatarUpload = ({close}) => {
    const user = useSelector((store) => store.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
    const handleUploadImg = async(e) => {
        const file = e.target.files[0]; // Fixed: 'files' not 'file'
        
        if(!file){
            return;
        }
        
        // File type validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
            return;
        }
        
        // File size validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        try {
            setLoading(true);
            
            const response = await Axios({
                ...summeryApis.UploadAvatar,
                data: formData
            });

            const { data: ResponseData } = response; 
            console.log(response);
            
            if (ResponseData.success) {
                dispatch(setUserAvatar(ResponseData.data.avatar));
                toast.success('Avatar uploaded successfully!');
                e.target.value = ''; // Reset file input
            } else {
                toast.error(ResponseData.message || 'Upload failed');
            }
            
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-950 opacity-60 p-4 flex items-center justify-center'>
            <div className='bg-white max-w-sm w-full p-4 flex flex-col items-center justify-center'>
                <button onClick={close} className='cursor-pointer w-fit block ml-auto'>
                            <IoClose size={20}/>
                </button>
                <div className='w-14 h-14 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-2xl'>
                    {
                        user.avatar ? ( 
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <FaRegUserCircle size={50} />
                        )
                    }
                </div>
                
                <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="file">
                        <div className='border border-amber-400 hover:bg-amber-200 cursor-pointer p-1 rounded-xl px-3 py-1 text-sm mt-3'>
                            {loading ? "Uploading..." : "Upload"}
                        </div>
                        
                        <input
                            onChange={handleUploadImg} 
                            className='hidden'
                            id='file'
                            name='file'
                            type="file"
                            accept="image/*"
                            disabled={loading}
                        />
                    </label>
                </form>
            </div>
        </section>
    );
};

export default UserProfileAvatarUpload;