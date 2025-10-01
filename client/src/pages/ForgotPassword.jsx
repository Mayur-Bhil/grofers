import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOff ,IoEye} from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';

const ForgotPassword = () => {

    const [data,setData] = useState({
        email:""
    });

    const navigate = useNavigate();

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
            ...summeryApis.forgot_password,
            data: {
                email: data.email,
            }
        })
        
        if(response.data.error){
            toast.error(response.data.message)
        }
        console.log(response);
        
        
        if(response.data.success){
            toast.success(response.data.message)
            navigate("/verify-otp",{
                state: data
        
            })
            // Reset form
            setData({
                email: "",
            })
            
        }
    } catch (error) {
        console.log(error);
        AxiosToastError(error)
    }      
}
    
  return (
    <section className="w-full container flex justify-center mx-auto px-2 ">
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded-lg shadow-gray-800 p-4'>
                    <p className='text-2xl font-semibold'>Forgot password</p>
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
                        <button disabled={!validateData } className={`${validateData?"bg-green-800 hover:bg-green-700":"bg-gray-500"} cursor-pointer mt-5 text-white tracking-wide py-2 rounded-lg font-semibold`}>Send OTP</button>
                    </form>
                    <p>
                        Don't have an Account?<Link to={"/register"} className='text-green-600 font font-semibold hover:text-green-800'>register</Link>
                    </p>
            </div>
    </section>
  )
}

export default ForgotPassword 
