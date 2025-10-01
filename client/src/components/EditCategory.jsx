import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImages from '../utils/uploadImages';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import Loading from './Loading';

const EditCategory = ({close,fetchdata,data:Categorydata}) => {
    const [loading,setLoading] = useState(false);
    const [data,setdata] = useState({
        _id : Categorydata._id,
        name:Categorydata.name,
        image:Categorydata.image
    });

    const HandleOnChange = (e)=> {
        const    {name,value} = e.target;
        setdata((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })

    }

    const HandelSubmit = async(e) =>{
        try {
            e.preventDefault();
            setLoading(true);
            const response = await Axios({
                ...summeryApis.UpdateCategory,
                data:data
            })
            const {data:responsedata} = response;
            
            if(responsedata.success){
                toast.success(responsedata.message);
                close()
                await fetchdata()
            }
        } catch (error) {
                AxiosToastError(error)
        }finally{
            setLoading(false)
        }

    }
    const HandleUploadCategory = async(e)=>{
        try {
            const file = e.target.files[0]

            if(!file){
                return;
            }
            setLoading(true)
            const response = await uploadImages(file)
            const {data : ImageResponse} = response;
        
            setdata((prev)=>{
                return {
                    ...prev,
                    image:ImageResponse.data.url
                }
            })
            setLoading(false)
            
        } catch (error) {
           AxiosToastError(error)
        }
        
    }   

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 opacity-80 flex items-center justify-center'>
                <div className='bg-white max-w-4xl p-4 w-full rounded '>
                    <div className='flex items-center justify-between font-semibold'>
                        <h1>Update Categoty</h1>
                        <button onClick={close} className='w-fit cursor-pointer block ml-auto'> 
                        <IoClose size={20}/>
                    </button>
            </div>
                    <form className='m-3 grid gap-2' onSubmit={HandelSubmit}>
                        <div className='grid gap-1'>
                            <label htmlFor="CategotyName"></label>
                            <input 
                            type="text" 
                            id='CategotyName'
                            name='name'
                            placeholder='Enter Category Name'
                            className='p-2 border-2 border-blue-500 focus-within:border-amber-300 outline-none rounded-sm'
                            value={data.name}
                            onChange={HandleOnChange}
             
                            />
                        </div>
                        <div className='grid gap-1'>
                            <p>Photo</p>
                            <div className='flex gap-4 flex-col lg:flex-row items-center'>
                                <div className='border bg-blue-50 h-36 rounded-sm w-36 flex justify-center items-center '>
                                    {
                                        data.image ? (
                                            <img className='h-full w-full object-scale-down' src={data.image} alt={"category"} />
                                        ):(
                                             <p className='text-sm'>{ loading ?  <Loading/> : "no Photo" }</p>

                                        )
                                    }
                            </div>
                            <label htmlFor="uploadCategoryimage">
                        <div 
                            
                            className={`
                                    ${!data.name ? "border-2":"bg-amber-300"}
                                        p-4 py-2 rounded-xl cursor-pointer
                                        border-amber-300 hover:bg-amber-300 
                                `}>
                                    {
                                        loading ? <Loading/> : "Upload Image"
                                    }
                                    </div>
                                <input disabled={!data.name} onChange={HandleUploadCategory } type="file" id='uploadCategoryimage' className='hidden' />
                            </label>
                            
                            </div>
                        </div>
                        <button
                        className={
                            `
                            ${data.name && data.image ? "bg-amber-300 hover:bg-amber-300 cursor-pointer" : "bg-slate-300"} py-2 font-semibold rounded-lg 
                            `
                        }
                        >
                        {
                            loading ? "Loading..." : "update Category"
                        }
                        </button>
                    </form>
                    </div>  
        </section>
    );
};

export default EditCategory;