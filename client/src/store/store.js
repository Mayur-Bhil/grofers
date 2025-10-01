import { configureStore } from '@reduxjs/toolkit'
import  UserReducer  from './userSclice.js'
import ProductReducer from "./ProductSclice.js"
import cartReducer from "./Cartslice.js"
import addressSlice from "./Address.slice.js"
import ordersReducer from './Order.slice.js';

export const store = configureStore({
  reducer: {
        user : UserReducer,
        product:ProductReducer,
        cart:cartReducer,
        address:addressSlice,
        orders: ordersReducer,
      }
})