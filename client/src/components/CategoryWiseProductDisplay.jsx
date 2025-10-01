import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/useAxios';
import summeryApis from '../common/summuryApi';
import CartProduct from './CartProduct';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import CardLoading from './CardLoading';

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const LoadingCardNumber = new Array(10).fill(null);
    const containerRef = useRef();

    const categoryData = useSelector((store) => store.product.allcategory);
    const SubcategoryData = useSelector((store) => store.product.allSubcategory);
    const navigate = useNavigate();

    // Helper function to create valid URLs (you'll need to implement this)
    const validUrl = (str) => {
        if (!str) return '';
        return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const fetchCategoryWiseProductData = async () => {
        try {
            setLoading(true); // Set loading to true at the start
            const response = await Axios({
                ...summeryApis.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response;

            // console.log(responseData);

            if (responseData.success) {
                setData(responseData.data)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProductData();
    }, [id]); // Add id as dependency

    const ScrollRight = () => {
        containerRef.current.scrollLeft += 300
    }

    const scrollLeft = () => {
        containerRef.current.scrollLeft -= 300
    }

    // Generate the redirect URL
    const getRedirectUrl = () => {
        try {
            // Find subcategory that belongs to this category
            const subCategory = SubcategoryData.find(sub => {
                return sub.category && sub.category.some(c => c._id === id);
            });

            if (!subCategory) {
                // Fallback URL - you might want to adjust this based on your routing structure
                return `/${validUrl(name)}-${id}`;
            }

            const url = `/${validUrl(name)}-${id}/${validUrl(subCategory?.name)}-${subCategory?._id}`;
            return url;

        } catch (error) {
            console.error('Error generating redirect URL:', error);
            // Fallback URL
            return `/${validUrl(name)}-${id}`;
        }
    };

    // Handle navigation programmatically if needed
    const handleSeeAllClick = (e) => {
        e.preventDefault();
        try {
            const url = getRedirectUrl();
            navigate(url);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between select-none'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link 
                    to={getRedirectUrl()} 
                    className='text-green-500 hover:text-green-600 transition-colors'
                    onClick={handleSeeAllClick}
                >
                    See All
                </Link>
            </div>
            
            {/* Wrapper for scroll container and navigation buttons */}
            <div className='relative container mx-auto px-2 md:px-4'>
                {/* Scrollable container */}
                <div className='flex items-start gap-4 py-4 overflow-x-scroll scrollbar-none lg:overflow-hidden scroll-smooth' ref={containerRef}>
                    {loading &&
                        LoadingCardNumber.map((_, index) => {
                            return (
                                <div key={"CategoryWiseProductDisplay" + index} className='min-w-48 w-48 h-80 flex-shrink-0'>
                                    <CardLoading />
                                </div>
                            )
                        })
                    }
                    {
                        data.map((product, index) => {
                            return (
                                <div key={product?._id + "CategoryWiseProductDisplay" + index} className='min-w-48 w-48 h-80 flex-shrink-0'>
                                    <CartProduct data={product} />
                                </div>
                            )
                        })
                    }
                </div>

                {/* Navigation buttons - positioned outside scrollable content */}
                <div className='absolute top-1/2 -translate-y-1/2 left-0 right-0 hidden lg:flex justify-between pointer-events-none select-none'>
                    <button 
                        onClick={scrollLeft} 
                        className='z-10 bg-white shadow-lg p-2 cursor-pointer hover:bg-gray-100 rounded-full text-lg pointer-events-auto ml-2'
                    >
                        <FaAngleLeft />
                    </button>
                    <button 
                        onClick={ScrollRight} 
                        className='z-10 bg-white shadow-lg p-2 cursor-pointer hover:bg-gray-100 rounded-full text-lg pointer-events-auto mr-2'
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay