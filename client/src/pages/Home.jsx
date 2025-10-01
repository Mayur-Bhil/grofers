import React from 'react'
import banner from "../assets/banner.jpg"
import banner_mobile from "../assets/banner-mobile.jpg"
import { useSelector } from 'react-redux'
import { validUrl } from '../utils/validUrlConvert'
import {Link, useNavigate} from "react-router-dom"
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector((store)=>store.product.loadingCategory);
  const categoryData = useSelector((store)=>store.product.allcategory);
  const SubcategoryData = useSelector((store)=>store.product.allSubcategory);
  const redirect = useNavigate();

const handleRedirectListpage = (id, cat) => {
    console.log(id, cat);
    
    const subCategory = SubcategoryData.find(sub => {
        return sub.category.some(c => c._id === id); // Use strict equality
    });
    
    // Add safety check for subCategory
    if (!subCategory) {
        console.error('Subcategory not found for id:', id);
        return; // Exit early if no subcategory found
    }
    
    const url = `/${validUrl(cat)}-${id}/${validUrl(subCategory.name)}-${subCategory._id}`;
    console.log("Url is", url);
    console.log(subCategory);
    
    redirect(url);
};
  return (
    <section className='bg-white select-none'>
        <div className='container mx-auto rounded'>
            <div className={`w-full h-full min-h-48 ${!banner && "animate-pulse my-2" }`}>
                <img src={banner}
                className='w-full h-full hidden lg:block'
                alt="" />

                <img src={banner_mobile}
                className='w-full h-full lg:hidden'
                alt="" />
            </div>
            <div className='container px-4 mx-auto my-3 gap-3 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10'>
                {
                  loadingCategory ? (
                    new Array(20).fill(null).map((c,idx)=>{
                    return (
                     
                            <div key={idx} className=' rounded p-4 min-h-24 bg-white lg:min-h-40 grid gap-2 shadow animate-pulse'>
                              <div className='bg-blue-100 max-h-20 lg:min-h-20 rounded'></div>
                              <div className='bg-blue-100 lg:h-8 h-3  rounded'></div>
                              {/* <div className='grid grid-cols-2 gap-4'>
                                  <div className='bg-blue-100 h-8 rounded'></div>
                                  <div className='bg-blue-100 h-8 rounded'></div>
                              </div> */}
                            </div>
                       
                    )
                     })
                  ):(

                        categoryData.map((cat,index)=>{
                          return <div key={index} onClick={()=>handleRedirectListpage(cat._id,cat.name)}>
                                    <div>
                                      <img src={cat.image} alt="" />
                                    </div>
                                </div> 
                      })
                    
                  )
                  
                }
            </div>
        </div>

        {/* Display category wise data cards etc */}
        
        <div className=''> 
              {
                categoryData.map((c,index)=>{
                  return <CategoryWiseProductDisplay key={c?._id+"CategoryWiseProducts"} id={c?._id} name={c?.name}/> 
                })
              }
                
        </div>

    </section>
  )
}

export default Home
