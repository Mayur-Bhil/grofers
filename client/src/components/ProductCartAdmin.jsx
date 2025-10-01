import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import { FaS } from 'react-icons/fa6';
import ConfirmBox from '../components/ConfirmBox';
import Axios from '../utils/useAxios';
import AxiosToastError from '../utils/AxiosToastError';
import summeryApis from '../common/summuryApi';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data,fetchProductData }) => {
   const [iseditOPen,setEditOpen] = useState(false);
   const [isopenDelete,setOpenDelete] = useState(false); 

   const HandleDeleteProduct = async(req,res)=>{
        try {
            const response = await Axios({
                ...summeryApis.deleteProduct,
                data:{
                    _id:data._id
                }
            })

            const {data:ResponceData} = response;

            if(ResponceData.success){
                toast.success(ResponceData.message);
                await fetchProductData();
            }
            setOpenDelete(false)
        } catch (error) {
            AxiosToastError(error)
        }
   }
    return (


            <div className='w-38 p-2 bg-white rounded-lg'>
                <div>
                    <img src={data?.Image[0]} alt={data?.name} 
                    className='h-full w-full object-scale-down'
                    />
                </div>
                <p className='text-ellipsis line-clamp-2 font-medium  '>{data?.name}</p>
                <p className='text-slate-500'>{data?.unit}</p>
                <div className='grid grid-cols-2 gap-3 p-2 '>
                    <button onClick={()=>setEditOpen(true)} className='border-2 rounded-lg px-2 text-sm py-1 bg-green-400 text-white border-green-600 hover:bg-green-200 hover:text-green-600'>Edit</button>
                    <button onClick={()=>setOpenDelete(true)} className='border-2 rounded-lg px-2 text-sm py-1 bg-red-400 text-black-400 border-red-600 hover:bg-red-300 hover:text-red-600'>Delete</button>
                </div>
                   
                    {
                        iseditOPen && (
                       <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)}/>

                        )
                    }
                    {
                        isopenDelete && <ConfirmBox confirm={HandleDeleteProduct} cancel={()=>setOpenDelete(false)} close={()=>setOpenDelete(false)} message={"Are You sure to permnently delete this Product   ?"}/>                          
                    }  
                                      
                </div>

    );
};

export default ProductCardAdmin;