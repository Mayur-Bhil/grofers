import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide name"],
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"please provide email"],
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address"
        ]
    },
    password:{
        type:String,
        required: [true, "Please enter password"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    avatar:{
        type:String,
        default:''
    },
    moblie:{
        type:Number,
        default:null,validate: {
            validator: function(v) {
                // Allow null/empty or valid 10-digit number
                return v === null || v === '' || /^[0-9]{10}$/.test(v);
            },
            message: "Please provide a valid 10-digit mobile number"
        }
    },
    refresh_token:{
        type:String,
        default:""
    },
    verify_email:{
        type:Boolean,
        default:false
    },
    last_login_date:{
        type:Date,
        default: null 
    },
    status:{
        type:String,
        enum:["active","inactive","suspended"],
        default:"active"
    },
    address_details:[{
        type:mongoose.Schema.ObjectId,
        ref:"Address"
    }],
    shopping_cart:[{
        type:mongoose.Schema.ObjectId,
        ref:"cartProduct"
    }],
    order_history:[{
        type:mongoose.Schema.ObjectId,
        ref:"Order"
    }],
    forgot_password_otp:{
        type:String,
        default:null
    },
    forgot_password_expiry:{
        type:Date,
        default:""

    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    }

},{
    timestamps:true
});

const User = mongoose.model("User",userSchema);
export default User;