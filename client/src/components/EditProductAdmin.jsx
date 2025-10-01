import React, { useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImages from '../utils/uploadImages';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from 'react-icons/md';
import {useSelector} from "react-redux"
import { IoClose } from 'react-icons/io5';
import AddFields from '../components/AddFields';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import successAlert from '../utils/successAlert';

const EditProductAdmin = ({close,data:propsData,fetchProductData}) => {
      const [data, setData] = useState({
        _id :propsData._id,
        name: propsData.name,
        Image: propsData.Image,
        category: propsData.category,
        sub_category: propsData.sub_category,
        unit: propsData.unit,
        stock:propsData.stock,
        price: propsData.price,
        discount:propsData.discount,
        desecription: propsData.desecription,
        more_details: propsData.more_details || {},
    });
    const [SelectCategory, setSelectCategory] = useState("");
    const [selectSubCategory, setSelectSubCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [viewImage, setViewImage] = useState("");
    const allCategory = useSelector((store) => store.product.allcategory);
    const allSubCategory = useSelector((store) => store.product.allSubcategory);
   
    const [openAddField, setOpenAddField] = useState(false);
    const [fieldName, setFieldName] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const HandleUploadImage = async (e) => {
        try {
            const file = e.target.files[0];
            
            if (!file) {
                return;
            }
            setLoading(true);
            const response = await uploadImages(file);
            const { data: ImageResponse } = response;
            const ImageUrl = ImageResponse.data.url;
            
            setData((prev) => ({
                ...prev,
                Image: [...prev.Image, ImageUrl]
            }));
            setLoading(false);
            
        } catch (error) {
           AxiosToastError(error);
        }
    };

    const HandleDeleteImage = (index) => {
        setData((prev) => {
            const newImages = [...prev.Image];
            newImages.splice(index, 1);
            return {
                ...prev,
                Image: newImages
            };
        });
    };

    // Fixed: Proper immutable state update
    const removeProductCategory = (index) => {
        setData((prev) => ({
            ...prev,
            category: prev.category.filter((_, i) => i !== index)
        }));
    };

    // Fixed: Proper immutable state update
    const removeProductSubCategory = (index) => {
        setData((prev) => ({
            ...prev,
            sub_category: prev.sub_category.filter((_, i) => i !== index)
        }));
    };

    const HandleAddField = () => {
        setData((prev) => ({
            ...prev,
            more_details: {
                ...prev.more_details,
                [fieldName]: ""
            }
        }));
        setFieldName("");
        setOpenAddField(false);
    };

    // Fixed: Added validation to prevent duplicate selections
    const handleCategorySelect = (e) => {
        const value = e.target.value;
        if (!value) return;
        
        const category = allCategory.find((el) => el._id === value);
        
        // Check if category is already selected
        const isAlreadySelected = data.category.some(cat => cat._id === value);
        if (isAlreadySelected) {
            setSelectCategory("");
            return;
        }
        
        setData((prev) => ({
            ...prev,
            category: [...prev.category, category]
        }));
        setSelectCategory("");
    };

    // Fixed: Added validation to prevent duplicate selections
    const handleSubCategorySelect = (e) => {
        const value = e.target.value;
        if (!value) return;
        
        const subCategory = allSubCategory.find((el) => el._id === value);
        
        // Check if subcategory is already selected
        const isAlreadySelected = data.sub_category.some(subCat => subCat._id === value);
        if (isAlreadySelected) {
            setSelectSubCategory("");
            return;
        }
        
        setData((prev) => ({
            ...prev,
            sub_category: [...prev.sub_category, subCategory]
        }));
        setSelectSubCategory("");
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        console.log("Data being sent:", data);
        try {
            const response = await Axios({
                ...summeryApis.updateProductDetails,
                data: data
            });

            const { data: ResponseData } = response;
            if (ResponseData.success) {
                successAlert(ResponseData.message);
                // Reset form after successful submission
                close()
                fetchProductData()
                setData({
                    name: "",
                    Image: [],
                    category: [],
                    sub_category: [],
                    unit: "",
                    stock: "",
                    price: "",
                    discount: "",
                    desecription: "",
                    more_details: {},
                });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };
  return (
    <section className='fixed top-0 right-0 bottom-0 left-0 bg-black p-4 z-50 opacity-90'>
            <div className='bg-white w-full p-4 max-w-2xl mx-auto overflow-y-auto h-full max-h-[95vh] scrollbar-none'>
        <section className=''>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Upload product</h2>
                <button className='cursor-pointer' onClick={close}>
                    <IoClose size={20}/>
                </button>
            </div>
            <div className='grid p-3'>
                <form onSubmit={HandleSubmit}>
                    <div className='grid gap-2 leading-none'>
                        <label className='font-medium' htmlFor="name">Name</label>
                        <input 
                            type="text"
                            placeholder='Product Name'
                            value={data.name}
                            onChange={handleChange}
                            name='name'
                            required
                            id='name'
                            className='bg-blue-100 p-2 outline-none border-2 rounded-md focus-within:border-amber-300'
                        />

                        <label className='font-medium' htmlFor="desecription">Description</label>
                        <textarea 
                            placeholder='Product description'
                            value={data.desecription}
                            onChange={handleChange}
                            name='desecription'
                            required
                            rows={3}
                            id='desecription'
                            className='bg-blue-200 p-2 outline-none border-2 rounded-md focus-within:border-amber-300 resize-none'
                        />
                    </div>
                    
                    <div className='grid gap-1'>
                        <p className='font-medium'>Image</p>
                        <div>
                            <label htmlFor='FileUpload' className='bg-slate-100 font-medium cursor-pointer min-h-24 border rounded-lg flex items-center justify-center'>
                                <div className='flex justify-center items-center flex-col'>
                                    {loading ? <Loading/> : <FaCloudUploadAlt size={29}/>}
                                    {loading ? "Uploading Image" : "Upload Image"}
                                </div>
                                <input
                                    id='FileUpload'
                                    type="file"
                                    className='hidden '
                                    onChange={HandleUploadImage}
                                    accept='image/*'
                                />
                            </label>
                            <div className='mt-2 flex gap-3'>
                                {data.Image.map((Image, index) => (
                                    <div key={`product-Image-${index}`}
                                         className='h-20 min-w-20 w-20 bg-blue-50 border-2 relative group'>
                                        <img 
                                            src={Image} 
                                            alt={`Product ${index}`}
                                            className='h-full w-full object-scale-down cursor-pointer'
                                            onClick={() => setViewImage(Image)}
                                        />
                                        <div 
                                            onClick={() => HandleDeleteImage(index)} 
                                            className='absolute bottom-0 right-0 p-1 bg-red-400 hidden group-hover:block text-white rounded-full cursor-pointer hover:bg-blue-600'
                                        >
                                            <MdDelete size={18}/>
                                        </div>  
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label className='font-medium' htmlFor="category">Category</label>
                        <div>
                            <select 
                                id="category" 
                                value={SelectCategory} 
                                onChange={handleCategorySelect}
                                className='w-full bg-blue-100 p-2 rounded'
                            >
                                <option value="">Select Category</option>
                                {allCategory.map((c, index) => (
                                    <option key={`${c._id}-${index}`} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <div className='flex flex-wrap gap-3'>
                                {data.category.map((c, index) => (
                                    <div className='flex p-2 text-sm gap-2 items-center bg-green-300 mt-1 rounded-lg' 
                                         key={`${c._id}-${index}-selected`}>
                                        <p>{c.name}</p>
                                        <div className='font-bold hover:text-red-500 hover:cursor-pointer' 
                                             onClick={() => removeProductCategory(index)}>
                                            <IoClose size={20}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label className='font-medium' htmlFor="subcategory">Sub Category</label>
                        <div>
                            <select 
                                id="subcategory"
                                value={selectSubCategory} 
                                onChange={handleSubCategorySelect}
                                className='w-full bg-blue-100 p-2 rounded'
                            >
                                <option value="">Select Sub Category</option>
                                {allSubCategory.map((c, index) => (
                                    <option key={`${c._id}-${index}`} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <div className='flex flex-wrap gap-3'>
                                {data.sub_category.map((c, index) => (
                                    <div className='flex p-2 text-sm gap-2 items-center bg-green-300 mt-1 rounded-lg' 
                                         key={`${c._id}-${index}-selected`}>
                                        <p>{c.name}</p>
                                        <div className='font-bold hover:text-red-500 hover:cursor-pointer' 
                                             onClick={() => removeProductSubCategory(index)}>
                                            <IoClose size={20}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label className='font-medium' htmlFor="unit">Unit</label>
                        <input 
                            type="text"
                            placeholder='Product Quantity'
                            value={data.unit}
                            onChange={handleChange}
                            name='unit'
                            required
                            id='unit'
                            className='bg-blue-100 p-2 outline-none border-2 rounded-md focus-within:border-amber-300'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label className='font-medium' htmlFor="stock">Stock</label>
                        <input 
                            type="number"
                            placeholder='Product stock'
                            value={data.stock}
                            onChange={handleChange}
                            name='stock'
                            required
                            id='stock'
                            className='bg-blue-100 p-2 outline-none border-2 rounded-md focus-within:border-amber-300'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label className='font-medium' htmlFor="price">Price</label>
                        <input 
                            type="number"
                            placeholder='Product Price'
                            value={data.price}
                            onChange={handleChange}
                            name='price'
                            required
                            id='price'
                            className='bg-blue-100 p-2 outline-none border-2 rounded-md focus-within:border-amber-300'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label className='font-medium' htmlFor="discount">Discount</label>
                        <input 
                            type="number"
                            placeholder='Product discount'
                            value={data.discount}
                            onChange={handleChange}
                            name='discount'
                            required
                            id='discount'
                            className='bg-blue-100 p-2 outline-none border-2 rounded-md focus-within:border-amber-300'
                        />
                    </div>

                    <div>
                        {Object.keys(data.more_details).map((k, index) => (
                            <div key={`${k}-${index}`} className='grid gap-1'>
                                <label htmlFor={k}>{k}</label>
                                <input
                                    id={k}
                                    type="text"
                                    value={data.more_details[k]}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            more_details: {
                                                ...prev.more_details,
                                                [k]: value
                                            }
                                        }));
                                    }}
                                    required
                                    className='bg-blue-100 p-2 outline-none border-2 rounded-md focus-within:border-amber-300'
                                />
                            </div>
                        ))}
                    </div>

                    <div 
                        onClick={() => setOpenAddField(true)} 
                        className='inline-block bg-amber-400 hover:bg-amber-300 py-2 px-3 w-32 mt-1 rounded-lg cursor-pointer text-center font-semibold border border-amber-300'
                    >
                        Add Fields
                    </div>
                    <button className='bg-amber-200 hover:bg-amber-300 py-2 font-semibold px-3 w-full rounded-lg mt-2'>
                            update product details
                    </button>
                </form>
            </div>

            {viewImage && (
                <ViewImage url={viewImage} close={() => setViewImage("")} />
            )}

            {openAddField && (
                <AddFields 
                    close={() => setOpenAddField(false)}
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    submit={HandleAddField}
                />
            )}
                </section>
            </div>
    </section>
  )
}

export default EditProductAdmin




