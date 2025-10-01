import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import UserProfileAvatarUpload from '../components/UserProfileAvatarUpload';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSclice';
import getUserDetails from '../utils/getUserDatails';

const Profile = () => {
    const user = useSelector((store)=>store.user);
    const [openProfileAvatarEdit,SetopenProfileAvatarEdit] =  useState(false);
    const dispatch = useDispatch();
    const [loading,SetLoading] = useState(false);
    const  [userData,setUserData] = useState({
        name:user.name,
        email:user.email,
        mobile:user.mobile
    });
    console.log(user);

    useEffect(()=>{
        setUserData({
        name:user.name,
        email:user.email,
        mobile:user.mobile
    })
    },[user])
    
    const handelOnChange = (e) =>{
        const {name,value} = e.target;

        setUserData((prev)=>{
            return {
                ...prev,
                [name]:value
            }

        })
    }

    const HandleSubmit = async(e)=>{
        e.preventDefault();
        try {
            SetLoading(true);
            const response = await Axios({
                    ...summeryApis.updateUser,
                    data:userData
            })
            const {data:responseData} = response
            console.log(response);
            

            if(responseData.success){
                toast.success(response.data.message);
                const Userdata = await getUserDetails();
      // console.log("data",Userdata.data.data);
             dispatch(setUserDetails(Userdata.data.data))
            }
            console.log(response);
        } catch (error) {
            AxiosToastError(error)
        }finally{
            SetLoading(false)
        }
        
    }
    return (
        <div>
            {/* profile upload and display Image */}
           <div className='w-14 h-14 bg-red-500 flex items-center justify-center rounded-full  overflow-hidden drop-shadow-2xl'>
                {
                    user.avatar ? ( 
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <FaRegUserCircle size={50} />
                    )
                }
           </div>
           <button onClick={()=>SetopenProfileAvatarEdit(true)} className='text-sm border min-w-14 px-3 py-1 mt-4 border-amber-300 hover:bg-amber-200 rounded-full'>edit</button>
           {
                openProfileAvatarEdit && (
                    <UserProfileAvatarUpload close={()=>SetopenProfileAvatarEdit(false)}/>
                )
           }
           {/* name ,email ,mobile etc */}
           <form action="" onSubmit={HandleSubmit} className='my-4 grid gap-2'>
            <div className='grid'>
                <label htmlFor="name">Name</label>
                <input type="text"
                placeholder='Name'
                className='grid p-2 bg-blue-50 outline-none border-2 focus-within:border-amber-300'
                name='name'
                id='name'
                value={userData.name}
                onChange={handelOnChange}
                required
                />
            </div>
            <div className='grid'>
                <label htmlFor="Email">Email</label>
                <input type="email"
                placeholder='Email'
                className='grid p-2 bg-blue-50 outline-none border-2 focus-within:border-amber-300'
                name='Email'
                id='Email'
                value={userData.email}
                onChange={handelOnChange}
                required
                />
            </div>
           <div className='grid'>
                <label htmlFor="Mobile">Mobile no</label>
                <input type="number"
                minLength={10}
                maxLength={12}
                required
                placeholder='1112223334'
                className='grid p-2 bg-blue-50 outline-none border-2 focus-within:border-amber-300'
                name='Mobile'
                id='Mobile'
                value={userData.mobile}
                onChange={handelOnChange}
                />
            </div>
            <button className='border px-4 py-2 hover:text-neutral-800 font-semibold rounded-xl focus-within:border-amber-300 bg-amber-100 hover:bg-amber-300 hover:scale-99 transition'>{loading ? "Loading..." : "Submit"}</button>
           </form>
        </div>
    );  
};

export default Profile;