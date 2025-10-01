import { createSlice } from "@reduxjs/toolkit";
const innitialvalue = {
    allcategory:[],
    allSubcategory:[],
    product:[],
    loadingCategory:true
}
const productSclice = createSlice({
    name:"product",
    initialState:innitialvalue,
    reducers:{
        setAllCategory:(state,action)=>{
           
            
               state.allcategory = [...action.payload] 
        },
        setloadingCategory:(state,action)=>{
            state.loadingCategory = action.payload
        },
        setAllSubCategory:(state,action)=>{
            state.allSubcategory = [...action.payload]
        },
        
    }
})




export const  {setAllCategory,setAllSubCategory,setloadingCategory} = productSclice.actions;
export default productSclice.reducer;