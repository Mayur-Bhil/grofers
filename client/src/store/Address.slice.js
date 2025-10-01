import { createSlice } from "@reduxjs/toolkit"


const innitialValue = {
    addressList:[]
}

const addressSlice = createSlice({
    name:"address",
    initialState:innitialValue,
    reducers:{
        addAddress:(state,action)=>{
                state.addressList  =[...action.payload]
        }
    }
})


export const {addAddress} = addressSlice.actions;
 export default addressSlice.reducer;