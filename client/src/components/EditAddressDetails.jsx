import React from 'react'
import { useForm} from "react-hook-form"
import { IoClose } from 'react-icons/io5';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/global.provider';

const EditAddressDetails = ({close, data}) => {
  console.log(data);
  
  const {fetchAddress} = useGlobalContext();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            _id:data?._id,
            userId:data?.userId,
            address_line: data?.address_line || '',
            city: data?.city || '',
            state: data?.state || data?.State || '', 
            country: data?.country || data?.Country || '',
            pincode: data?.pincode || '',
            mobile: data?.mobile || data?.Mobile || ''
        }
    });
    
    const onSubmit = async(formData) => {
        console.log(formData);
        try {
            const response = await Axios({
                ...summeryApis.updateAddress,
                data: {
                    _id:data?._id,
                    address_line: formData.address_line, // ✅ Fixed
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    pincode: formData.pincode,
                    mobile: formData.mobile
                }
            })

            const {data: responseData} = response;
            
            if(responseData.success){
                toast.success(responseData.message)
                await fetchAddress() 
                if (close){
                    close();  
                } 
            }
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            console.error('Error response data:', error.response?.data);
            
            AxiosToastError(error)    
        }
    }

    return (
        <section className='bg-black fixed top-0 left-0 opacity-80 right-0 bottom-0 w-full z-50 overflow-y-auto'>
            <div className='bg-white p-4 w-full max-w-lg mx-auto mt-8 rounded'>
                <div className='flex justify-between items-center '>
                    <h2 className='font-bold'> Edit address</h2>
                    <IoClose onClick={close} className='cursor-pointer hover:text-amber-300'  size={25}/>
                </div>
                
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor="address_line">Address Line : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="address_line"
                            placeholder='earth'
                            {...register("address_line", {
                                required: "Address is required"   
                            })}
                        />
                        {errors.address_line && <span className="text-red-500 text-sm">{errors.address_line.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="city">City : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="city"
                            placeholder='surat'
                            {...register("city", {
                                required: "City is required"   
                            })}
                        />
                        {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="state">State : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="state"
                            placeholder='Gujarat'
                            {...register("state", {
                                required: "State is required"   
                            })}
                        />
                        {errors.state && <span className="text-red-500 text-sm">{errors.state.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="pincode">Pincode : </label>
                        <input 
                            type='number'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="pincode"
                            placeholder='395010'
                            {...register("pincode", {
                                required: "Pincode is required"   
                            })}
                        />
                        {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="country">Country : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="country"
                            placeholder='bharat'
                            {...register("country", { 
                                required: "Country is required"   
                            })}
                        />
                        {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="mobile">Mobile : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="mobile"
                            placeholder='9106706932'
                            {...register("mobile", { 
                                required: "Mobile number is required"   
                            })}
                        />
                        {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile.message}</span>}
                    </div>
                    
                    <button type='submit' className='bg-amber-300 w-full py-2 px-2 font-semibold hover:bg-amber-200'>
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditAddressDetails