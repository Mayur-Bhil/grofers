import { Outlet, useLocation } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast,{ Toaster } from "react-hot-toast"
import { useEffect } from 'react'
import getUserDetails from './utils/getUserDatails.js'
import { setUserDetails } from './store/userSclice.js'
import { useDispatch } from 'react-redux'
import { setAllCategory ,setAllSubCategory, setloadingCategory} from './store/ProductSclice.js'
import Axios from './utils/useAxios'
import summeryApis from './common/summuryApi'
import  GlobalContextProvider  from './provider/global.provider';

import { IoCartSharp } from "react-icons/io5";
import CartMobileLink from './components/CartMobile.jsx'

function App() {
   const dispatch = useDispatch();
const location = useLocation();



   const fetchUser = async() =>{
      try {
        const Userdata = await getUserDetails();
      // console.log("data",Userdata.data.data);
        dispatch(setUserDetails(Userdata.data.data))
      } catch (error) {
        
      }

   }  

   const fetchCategory = async () => {
      dispatch(setloadingCategory(true))
      try {
        const response = await Axios({
          ...summeryApis.getCategory,
        });
        const { data: responseData } = response;
           
        if (responseData.success) {
            dispatch(setAllCategory(responseData.data))
        }
              
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        dispatch(setloadingCategory(false))
      }
    };

   const fetchSubCategory = async()=>{
    try {
                 
       const response = await Axios({
          ...summeryApis.getsubCategory,
        });
        const { data: responseData } = response;
           
        if (responseData.success) {
            dispatch(setAllSubCategory(responseData.data))
        }
              
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
             
      } 
   }

 

  useEffect(()=>{
      fetchUser()
      fetchCategory();
      fetchSubCategory();     
   },[])
     
   return (
    <GlobalContextProvider>
      <Header/>
      <main className='min-h-[80vh] py-[0.1px]'>
          <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
      {
        location.pathname !== "/checkout" && (
            <CartMobileLink/>
        )
      } 
    </GlobalContextProvider>
   )
}

export default App