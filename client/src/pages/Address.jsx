import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Devider from '../components/Devider';
import AddressAdd from '../components/AddressAdd';
import { MdDelete, MdEditDocument } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/global.provider';

const Address = () => {
    const address = useSelector((store)=>store?.address.addressList);
    const [addressOpen,setAddressOpen] = useState(false);
    const [openEdit,setOpenEdit] = useState(false); 
    const [editData,setEditData] = useState({

    });
    console.log("Address page",address );
    const {fetchAddress} = useGlobalContext();
    const handleDisableAddress= async(id)=>{
        try {
            const response = await Axios({
            ...summeryApis.dissableAddress,
            data:{
                _id:id
            }
        })
        const {data:responseData} = response;

        if(responseData.success){
            toast.success("Address Remove")
            fetchAddress()
        }
        } catch (error) {
            AxiosToastError(error)
        }
    }
    return (
        <div className='bg-white p-2 grid gap-3'>
                            <div className='bg-white px-2 py-2 flex justify-between gap-2 items-center shadow-md font-semibold '>
                                <h2>Address</h2>
                                <button 
                                onClick={()=>setAddressOpen(true)}
                                className='bg-white text-amber-200 px-3 py-3 border border-amber-300 rounded-full cursor-pointer hover:text-black hover:bg-amber-200'>
                                    Add address
                                </button>
                            </div>
                        {
                          address.map((address,index)=>{
                              return ( 
                              <div key={index}>
                              <div className={`rounded p-3 flex gap-3 items-center  border-1 hover:bg-zinc-50 cursor-pointer ${!address.status && "hidden"}`}>
                                  
                              <div id='address' key={`${index}+"Address"`} className='w-full  p-2'>
                                            
                                            <p>{address?.address_line}</p>
                                            <p>{address?.city}</p>
                                            <p>{address?.state}</p>
                                            <p>{address?.country} - {address?.pincode}</p>
                                            <p>{address?.mobile}</p>
                                         
                                    </div>
                                    <div className='m-2 flex gap-3'>
                                        <button onClick={()=>
                                        { 
                                            setOpenEdit(true)
                                            setEditData(address)
                                        }} 
                                        className='bg-green-300 p-1 rounded-full hover:text-shadow-white cursor-pointer hover:bg-green-400'>
                                                <MdEditDocument size={25} />
                                        </button>
                                        <button onClick={()=>{
                                            handleDisableAddress(address._id)
                                        }} className='bg-red-300 p-1 rounded-full hover:text-shadow-white cursor-pointer hover:bg-red-400'>
                                            <MdDelete size={25} />
                                        </button>
                                      
                                    </div>
                              </div> 
                              <Devider/>
                              </div>
                          
                              )
                          }) 
                        }
                      <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex items-center justify-center'>
                          Add address
                    </div>
                    {
                        addressOpen && (
                            <AddressAdd close={()=>setAddressOpen(false)}/>
                        ) 
                    }

                    {
                        openEdit && (
                            <EditAddressDetails close={()=>setOpenEdit(false)} data={editData}/>
                        )
                    }
                    </div>
    );
};

export default Address;  