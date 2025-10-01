import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';


const OtpVerification = () => {

    const [data,setData] = useState(["","","","","",""]);

    const navigate = useNavigate();
    const inputRef = useRef([]);
    const location = useLocation();
    const validateData = data.every(el => el)

    console.log("location",location);

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/reset-password");
        }
    },[]);
    
    const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !data[index] && index > 0) {
        inputRef.current[index - 1]?.focus();
        }
    }
    
const handelSubmit = async(e) => {
    e.preventDefault();

    try {
        const response = await Axios({
            ...summeryApis.verify_Otp,
            data: {
                otp: data.join(""),
                email: location?.state?.email
            }
        })
        
        console.log("Full response:", response);
        console.log("Response data:", response.data);
        
        // Check multiple possible success conditions
        const isSuccess = response.data.success === true || 
                         response.data.success === "true" || 
                         response.data.status === "success" ||
                         response.status === 200;
        
        if(isSuccess) {
            toast.success(response.data.message)
            // alert("Otp verified successfully")
            navigate("/reset-password", { 
                state: { 
                    data: response.data,
                    email: location?.state?.email,
                } 
            })

        } else {
            toast.error(response.data.message || "Verification failed")
        }
        
    } catch (error) {
        console.log(error);
        AxiosToastError(error)
    }      
} 
  return (
    <section className="w-full container flex justify-center mx-auto px-2 ">
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded-lg shadow-gray-800 p-4'>
                    <p className='text-2xl font-semibold'>Enter Your OTP</p>
                    <form action="/login" onSubmit={handelSubmit} className='grid gap-2 mt-5'>
                       
                        <div className='grid gap-1' >
                            <div className='flex items-center gap-2 justify-between mt-3'>
                                {data.map((elem,index)=>{
                                        return (
                                                <input
                                                ref={(ref)=>{
                                                    inputRef.current[index] = ref
                                                    return ref  
                                                }}
                                                key={index}
                                                type="text"
                                                value={data[index]}
                                                maxLength={1}
                                                className='bg-blue-50 text-center font-semibold  w-full max-w-20 gap-2 p-1 outline-none border-2 rounded-sm focus:border-amber-300 '
                                                onChange={(e)=>{
                                                    const value = e.target.value
                                                    // console.log(value);  
                                                    const newData = [...data]
                                                    newData[index] = value
                                                    setData(newData)
                                                    if (value && index<5) {
                                                        inputRef.current[index+1].focus()
                                                    }
                                                }} 
                                                onKeyDown={(e)=>handleKeyDown(e,index)} 
                                                name='otp'
                                                />
                                        )
                                })}
                            </div>
                            
                        </div>                    
                        <button disabled={!validateData } className={`${validateData?"bg-green-800 hover:bg-green-700":"bg-gray-500"} cursor-pointer mt-5 text-white tracking-wide py-2 rounded-lg font-semibold`}>verify OTP</button>
                    </form>
                    <p>
                        Already have an Account?<Link to={"/login"} className='text-green-600 font font-semibold hover:text-green-800'>register</Link>
                    </p>
            </div>
    </section>
  )
}

export default OtpVerification
