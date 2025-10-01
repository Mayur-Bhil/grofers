import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOff ,IoEye} from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';

const Register = () => {

    const [data,setData] = useState({
        name: "",
        email :"",
        password:"",
        confirmpassword:""
    });

    const [showPassword,setShowpassword] = useState(false);
    const [showconfirmpassword,setShowConfirmPassword] = useState(false);
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

    if(data.password !== data.confirmpassword){
        toast.error("password and confirm password must be same")
        return;
    }

    try {
        const response = await Axios({
            ...summeryApis.register,
            data: {
                name: data.name,
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
            // Reset form
            setData({
                name: "",
                email: "",
                password: "",
                confirmpassword: ""
            })
            navigate("/login")
        }
    } catch (error) {
        console.log(error);
        AxiosToastError(error)
    }      
}
    
  return (
    <section className="w-full container flex justify-center mx-auto px-2">
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded-lg shadow-gray-800 p-4 mt-9'>
                    <p className='text-2xl'>Welcome to Blinkit</p>
                    <form action="/login" onSubmit={handelSubmit} className='grid gap-2 mt-5'>
                        <div className='grid gap-1' >
                            <label htmlFor="name" className='font-semibold '>Name :</label>
                            <input 
                            id='name'
                            type="text"
                            autoFocus
                            className='bg-blue-50 p-1 border-2 outline-none rounded-sm focus:border-amber-300 '
                            value={data.name}
                            onChange={handelChange}
                            name='name'
                            placeholder='Enter name'
                            />

                        </div>
                        <div className='grid gap-1' >
                            <label htmlFor="email" className='font-semibold '>Email :</label>
                            <input 
                            id='email'
                            type="email"
                            className='bg-blue-50 p-1 outline-none border-2 rounded-sm focus:border-amber-300 '
                            value={data.email}
                            onChange={handelChange}
                            name='email'
                            placeholder='Enter Email'
                            />
                        </div>
                        <div className='grid gap-1' >
                            <label htmlFor="password" className='font-semibold '>password :</label>
                            <div className='bg-blue-50 p-1 border-2 rounded-sm flex items-center justify-between focus-within:border-amber-300 '>
                                <input 
                            id='password'
                            type={showPassword ? "text" : "password"}
                            autoFocus
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

                        </div>
                         <div className='grid gap-1' >
                            <label htmlFor="confirmpassword" className='font-semibold '>Confirm Your password :</label>
                            <div className='bg-blue-50 p-1 border-2 rounded-sm flex items-center justify-between focus-within:border-amber-300 '>
                                <input 
                            id='confirmpassword'
                            type={showconfirmpassword ? "text" : "password"}
                            autoFocus
                            className='w-full outline-none'
                            value={data.confirmpassword}
                            onChange={handelChange}
                            name='confirmpassword'
                            placeholder='******'
                            />
                            <div className='cursor-pointer mx-2' onClick={()=>setShowConfirmPassword(prev=> !prev)}>
                                {
                                    showconfirmpassword ?(
                                        <IoEye />
                                    ):(
                                        <IoEyeOff />
                                    )
                                }
                            </div>
                            </div>

                        </div>
                        <button disabled={!validateData } className={`${validateData?"bg-green-800 hover:bg-green-700":"bg-gray-500"} cursor-pointer mt-5 text-white tracking-wide py-2 rounded-lg font-semibold`}>Register</button>
                    </form>
                    <p>
                        Already have an Account?<Link to={"/login"} className='text-green-600 font font-semibold hover:text-green-8 00'>Login</Link>
                    </p>
            </div>
    </section>
  )
}

export default Register 
