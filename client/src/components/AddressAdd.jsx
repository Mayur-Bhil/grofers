import React from 'react'
import { useForm} from "react-hook-form"
import { IoClose } from 'react-icons/io5';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/global.provider';

const AddressAdd = ({close}) => {
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { fetchAddress} = useGlobalContext();
    
    
    const onSubmit = async(data) => {
        console.log(data);
        try {
            const response = await Axios({
                ...summeryApis.createAddress,
                data: {
                    address_line: data.address,
                    city: data.city,
                    state: data.State,
                    country: data.Country,
                    pincode: data.pincode,
                    mobile: data.Mobile
                }
            })

            const {data: responseData} = response;
            
            if(responseData.success){
                toast.success(responseData.message)
                fetchAddress(); 
                if (close){
                    close();  
                } 
            }
        } catch (error) {
            // Debug logging only - no toast
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            console.error('Error response data:', error.response?.data);
            
            // Temporarily disabled all error toasts for debugging
            // toast.error('Error occurred');
            
            // Keep your original error handler as backup
            AxiosToastError(error)    
        }
    }

    return (
        <section className='bg-black fixed top-0 left-0 opacity-80 right-0 bottom-0 w-full z-50 overflow-y-auto'>
            <div className='bg-white p-4 w-full max-w-lg mx-auto mt-8 rounded'>
                <div className='flex justify-between items-center '>
                    <h2 className='font-bold'> Add address</h2>
                    <IoClose onClick={close} className='cursor-pointer hover:text-amber-300'  size={25}/>
                </div>
                
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor="address">Address Line : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="address"
                            placeholder='earth'
                            name='address'
                            {...register("address", {
                                required: "Address is required"   
                            })}
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="city">City : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="city"
                            placeholder='surat'
                            name='city'
                            {...register("city", {
                                required: "City is required"   
                            })}
                        />
                        {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="State">State : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="State"
                            placeholder='Gujarat'
                            name='State'
                            {...register("State", {
                                required: "State is required"   
                            })}
                        />
                        {errors.State && <span className="text-red-500 text-sm">{errors.State.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="pincode">Pincode : </label>
                        <input 
                            type='number'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="pincode"
                            placeholder='395010'
                            name='pincode'
                            {...register("pincode", {
                                required: "Pincode is required"   
                            })}
                        />
                        {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="Country">Country : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="Country"
                            placeholder='bharat'
                            name='Country'
                            {...register("Country", { 
                                required: "Country is required"   
                            })}
                        />
                        {errors.Country && <span className="text-red-500 text-sm">{errors.Country.message}</span>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="Mobile">Mobile : </label>
                        <input 
                            type='text'
                            className='gap-1 p-2 outline-blue-200 border-2 '
                            id="Mobile"
                            placeholder='9106706932'
                            name='Mobile'
                            {...register("Mobile", { 
                                required: "Mobile number is required"   
                            })}
                        />
                        {errors.Mobile && <span className="text-red-500 text-sm">{errors.Mobile.message}</span>}
                    </div>
                    
                    <button type='submit' className='bg-amber-300 w-full py-2 px-2 font-semibold hover:bg-amber-200'>
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddressAdd