import { createSlice } from '@reduxjs/toolkit'

const innitalValue = {
    _id :"",
    name :"",
    email:"",
    avatar:"",
    mobile:"",
    verify_email:false,
    status:"",
    address_details: [],
    shopping_cart:[],
    role:"",
    order_history:[],
    last_login_date:""
    

}
export const UserSclice = createSlice({
    name:"user",
    initialState:innitalValue,
    reducers:{
        setUserDetails: (state,action)=>{
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.mobile = action.payload?.mobile
            state.verify_email = Boolean(action.payload?.verify_email)  
            state.last_login_date = action.payload?.last_login_date
            state.status = action.payload?.status
            state.address_details = action.payload?.address_details
            state.shopping_cart = action.payload?.shopping_cart
            state.role = action.payload?.role
            state.order_history = action.payload?.order_history




        },
        logoutUser:(state)=>{
            state._id = ""      
            state.name = ""
            state.email = ""
            state.avatar = ""
            state.mobile = ""
            state.verify_email = ""
            state.last_login_date =""
            state.status = ""
            state.address_details = []
            state.shopping_cart = []
            state.role = ""
            state.order_history = []
        },
        setUserAvatar:(state,action)=>{
            state.avatar = action.payload
        },
        setUserData:(state,action)=>{
             state.name = action.payload?.name
            state.email = action.payload?.email
            state.mobile = action.payload?.mobile
        }
        
    }
    
})




export const {setUserDetails,logoutUser,setUserAvatar } = UserSclice.actions;
export default UserSclice.reducer;
