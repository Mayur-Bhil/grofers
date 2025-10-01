import mongoose, { Mongoose } from "mongoose";

const cartproductSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    
},{
    timestamps:true
})

const cartProduct = mongoose.model("cartProduct",cartproductSchema)
export default cartProduct;