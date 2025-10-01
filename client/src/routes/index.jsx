import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMobileMenupage from "../pages/UserMobileMenupage";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/Myorders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProuct";
import ProductByAdmin from "../pages/ProductByAdmin";
import AdminPermission from "../layout/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import CartMobileLink from "../components/CartMobile";
import CheckOutpage from "../pages/CheckOutpage";
import Success from "../components/Success";
import Cancel from "../components/Cancel";
import AdminDashboard from "../components/Dashboard"



const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"",
                element:<Home/>
            },{
                path:"search",
                element:<SearchPage/>
            },{
                path:"login",
                element :<Login/>
            },{
                path:"register",
                element:<Register/>
            },
            {
                path:"forgot-password",
                element:<ForgotPassword/>
            },{
                path:"verify-otp",
                element:<OtpVerification/>
            },{
                path:"reset-password",
                element:<ResetPassword/>
            },
            {
                path:"user",
                element:<UserMobileMenupage/>
            },{
                path:"dashboard",
                element:<Dashboard/>,
                children:[
                    {
                        path:"profile",
                        element:<Profile/>
                    },{
                        path:"myorders",
                        element:<MyOrders/>
                    },
                    {
                        path:"address",
                        element:<Address/>
                    },{
                        path:"category",
                        element:<AdminPermission>
                                    <CategoryPage/>
                                </AdminPermission>
                    },{
                        path:"sub-category",
                        element:<AdminPermission>
                            <SubCategoryPage/>
                        </AdminPermission>

                    },
                    {
                        path:"upload-products",
                        element:<AdminPermission>
                            <UploadProduct/>
                        </AdminPermission>
                    },{
                        path:"product",
                        element:<AdminPermission>
                            <ProductByAdmin/>
                        </AdminPermission>
                    }
                ]
            },{
                path:":category",
                children:[
                    {
                        path:":subcategory",
                        element:<ProductListPage/>
                    }
                ]
            },{
                path:"product/:product",
                element:<ProductDisplayPage/>
            },
            
            {
                path:"cart",
                element:<Cart/>
            },
            {
                path:"checkout",
                element:<CheckOutpage/>
            },
            {
                path:"success",
                element:<Success/>
            },
            {
                path:"cancel",
                element:<Cancel/>
            },
            {
        path: "/admin/dashboard",
        element: (
            <AdminPermission>
                <AdminDashboard />
            </AdminPermission>
        )
},
            {
                path:"*",
                element:<NotFound/>
            }
        ]
    }
])


export default router;