import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOff ,IoEye} from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';
import getUserDetails from '../utils/getUserDatails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSclice';

const Login = () => {

    const [data,setData] = useState({
        email :"",
        password:"",
    });

    const [showPassword,setShowpassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handelChange = (e) =>{
        const {name,value} = e.target;
        setData((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })

    }
    const validateData = Object.values(data).every(el => el)
    
    const handelSubmit = async(e) => {
    e.preventDefault();

    try {
        const response = await Axios({
            ...summeryApis.login,
            data: {
                email: data.email,
                password: data.password
            }
        })
        
        if(response.data.error){
            toast.error(response.data.message)
        }
        console.log(response);
        
        
        if(response.data.success){
            toast.success(response.data.message)
            localStorage.setItem("accessToken",response.data.data.accessToken)
            localStorage.setItem("refreshToken",response.data.data.refreshToken)
            
            const UserDetails = await getUserDetails();
            dispatch(setUserDetails(UserDetails.data.data))
            // Reset form
            setData({
                name: "",
                email: "",  
                password: "",
            })
            navigate("/")
        }
    } catch (error) {
        console.log(error);
        AxiosToastError(error)
        }      
    }
    
  return (
    <section className="w-full select-none container flex justify-center mx-auto px-2 ">
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded-lg shadow-gray-800 p-4'>
                    <p className='text-2xl font-semibold'>Login to procceed</p>
                    <form action="/login" onSubmit={handelSubmit} className='grid gap-2 mt-5'>
                       
                        <div className='grid gap-1' >
                            <label htmlFor="email" className='font-semibold '>Email :</label>
                            <input 
                            id='email'
                            type="email"
                            className='bg-blue-50 p-1 outline-none border-2 rounded-sm focus:border-amber-300 '
                            value={data.email}
                            onChange={handelChange}
                            name='email'
                            autoFocus
                            placeholder='Enter Email'
                            />
                        </div>
                        <div className='grid gap-1' >
                            <label htmlFor="password" className='font-semibold '>password :</label>
                            <div className='bg-blue-50 p-1 border-2 rounded-sm flex items-center justify-between focus-within:border-amber-300 '>
                                <input 
                            id='password'
                            type={showPassword ? "text" : "password"}
                            className='w-full outline-none'
                            value={data.password}
                            onChange={handelChange}
                            name='password'
                            placeholder='******'
                            />
                            <div className='cursor-pointer mx-2' onClick={()=>setShowpassword(prev=> !prev)}>
                                {
                                    showPassword ?(
                                        <IoEye />
                                    ):(
                                        <IoEyeOff />
                                    )
                                }
                            </div>
                            </div>
                                <Link to={"/forgot-password"} className='block ml-auto text-green-400 hover:text-amber-400'>Forgot passwpord ?</Link>
                        </div>
                        
                        <button disabled={!validateData } className={`${validateData?"bg-green-800 hover:bg-green-700":"bg-gray-500"} cursor-pointer mt-5 text-white tracking-wide py-2 rounded-lg font-semibold`}>login</button>
                    </form>
                    <p>
                        Don't have an Account?<Link to={"/register"} className='text-green-600 font font-semibold hover:text-green-800'>register</Link>
                    </p>
            </div>
    </section>
  )
}

export default Login 
