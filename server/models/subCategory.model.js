import { referrerPolicy } from "helmet";
import mongoose, { Mongoose } from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name :{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    category:[{
        type:mongoose.Schema.ObjectId,
        ref:"Category"
    }]
},{
    timestamps:true
})

const subCategory = mongoose.model("subCategory",subCategorySchema)
export default subCategory;