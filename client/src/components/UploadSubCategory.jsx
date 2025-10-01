import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImages from '../utils/uploadImages';
import Loading from './Loading';
import AxiosToastError from '../utils/AxiosToastError';
import summeryApis from '../common/summuryApi';
import toast from 'react-hot-toast';
import Axios from '../utils/useAxios';
import { useSelector } from 'react-redux';

const UploadSubCategory = ({close,fetchData}) => {
    const [subCategoryData, setsubCategotyData] = useState({
        name: "",
        image: "",
        category: []
    });
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    
    const HandleOnChange = (e) => {
        const { name, value } = e.target;
        setsubCategotyData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }


const HandelSubmitSubCategory = async (e) => {
    e.preventDefault();
    
    try {
        setLoading(true);
        
        // ✅ Optional: Client-side validation
        if (!subCategoryData.name || !subCategoryData.image || !subCategoryData.category || subCategoryData.category.length === 0) {
            toast.error("Please fill all required fields");
            return;
        }

        const response = await Axios({
            ...summeryApis.createSubcategory,
            data: subCategoryData
        });

        const { data: responseData } = response;

        if (responseData.success) {
            toast.success(responseData.message);
            close();
            if (fetchData) fetchData();
        }
        
    } catch (error) {
        AxiosToastError(error);
    } finally {
        setLoading(false);
    }
}

    const HandleUploadSubCategory = async (e) => {
        try {
            setImageLoading(true);
            const file = e.target.files[0];
            if (!file) {
                setImageLoading(false);
                return;
            }

            const response = await uploadImages(file);
            
            // Handle different response structures
            let imageUrl = '';
            if (response.data && response.data.data && response.data.data.url) {
                imageUrl = response.data.data.url;
            } else if (response.data && response.data.url) {
                imageUrl = response.data.url;
            } else if (response.url) {
                imageUrl = response.url;
            } else if (response.data && response.data.secure_url) {
                imageUrl = response.data.secure_url;
            }

            if (imageUrl) {
                setsubCategotyData((prev) => {
                    return {
                        ...prev,
                        image: imageUrl
                    }
                });
            } else {
                console.error('No image URL found in response:', response);
                toast.error('Failed to get image URL');
            }
            
        } catch (error) {
            AxiosToastError(error);
            console.error('Upload error:', error);
        } finally {
            setImageLoading(false);
        }
    }
    const handelSelectedCategory = (CategoryId)=>{
        const index = subCategoryData.category.find(el => el._id === CategoryId);
        subCategoryData.category.splice(index,1)
        setsubCategotyData((prev)=>{
                return {
                    ...prev
                }
        })
    }

    const allCategory = useSelector(store => store.product.allcategory);

    console.log(subCategoryData);
    
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 opacity-95 flex items-center justify-center z-50'>
            <div className='bg-white max-w-4xl p-4 w-full rounded'>
                <div className='flex items-center justify-between font-semibold'>
                    <h1>sub Category</h1> 
                    <button onClick={close} className='w-fit cursor-pointer block ml-auto'> 
                        <IoClose size={20}/>
                    </button>
                </div>
                <form className='m-3 grid gap-2' onSubmit={HandelSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor="CategoryName">Name</label>
                        <input 
                            type="text" 
                            id='CategoryName'
                            name='name'
                            placeholder='Enter Sub Category Name'
                            className='p-2 border-2 border-blue-500 focus-within:border-amber-300 outline-none rounded-sm'
                            value={subCategoryData.name}
                            onChange={HandleOnChange}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Photo</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 rounded-sm w-36 flex justify-center items-center overflow-hidden'>
                                {
                                    subCategoryData.image ? (
                                        <img 
                                            className='max-h-full max-w-full object-scale-down mt-10' 
                                            src={subCategoryData.image} 
                                            alt="sub-category"
                                            onLoad={() => console.log('Image loaded successfully')}
                                            onError={(e) => {
                                                console.error('Image failed to load:', e);
                                                console.error('Image URL:', subCategoryData.image);
                                            }}
                                        />
                                    ) : (
                                        <div className='text-sm'>
                                            {imageLoading ? <Loading/> : "No Photo"}
                                        </div>
                                    )
                                }
                            </div>
                            <label htmlFor="uploadSubCategoryimage">
                                <div 
                                    className={`
                                        ${!subCategoryData.name ? "border-2" : "bg-amber-300"}
                                        p-4 py-2 rounded-xl cursor-pointer
                                        border-amber-300 hover:bg-amber-300 
                                    `}>
                                    {imageLoading ? "Uploading..." : "Upload image"}
                                </div>
                                <input 
                                    disabled={!subCategoryData.name || imageLoading} 
                                    onChange={HandleUploadSubCategory} 
                                    type="file" 
                                    id='uploadSubCategoryimage' 
                                    className='hidden' 
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>  
                    <button 
                        type="submit"
                        disabled={!subCategoryData.name || !subCategoryData.image || loading}
                        className={`
                            ${subCategoryData.name && subCategoryData.image && !loading 
                                ? "bg-amber-300 hover:bg-amber-400 cursor-pointer" 
                                : "bg-slate-300 cursor-not-allowed"} 
                            py-2 font-semibold rounded-lg transition-colors
                        `}
                    >
                        {loading ? <Loading/> : "Add Category"}
                    </button>
                    <div className='grid gap-1'>
                        <label htmlFor="">Select Categoty</label>
                        <div className='flex flex-wrap gap-2 '>
                            {
                            subCategoryData.category.map((cat,index)=>{
                                return <div key={index} className='flex'>
                                    <p
                                    className='bg-white shadow-md px-1 m-1 border'
                                        key={cat._id+"selectedValue"}
                                    >
                                    {cat.name}
                                    <span onClick={()=>handelSelectedCategory(cat._id)} className='p-4 font-bold cursor-pointer text-red-500'>X</span>
                                    </p>
                                </div>
                            })
                        }
                        </div>
                        <select onChange={(e)=>{
                            const value = e.target.value;
                            const CategoryDetails = allCategory.find(cat =>cat._id == value)
                            setsubCategotyData((prev)=>{
                                return {
                                    ...prev,
                                    category:[...prev.category,CategoryDetails]
                                }
                            })
                        }} name="" id=""
                        className='bg-blue-50  p-3 outline-none border'>
                            <option value={""}>select Category</option>
                               {
                                    allCategory.map((category)=>{
                                        return <option
                                        key={category._id+"sun Category"}
                                        value={category?._id}>
                                                        {category?.name}
                                                </option>
                                    })
                                
                                }
                        </select>
                    </div>

                </form>
            </div>  
        </section>
    );
};

export default UploadSubCategory;