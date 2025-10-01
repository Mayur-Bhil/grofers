import sendEmail from "../config/sendEmail.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import verificatioEmailTemplate from "../utils/verifyEmailTEmplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generaterefreshToken from "../utils/generateRefressToken.js";
import uploadImageCloudinary from "../utils/uploadImagesToCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotpasswordTemplate from "../utils/forgotpasswordtemplate.js";
import jwt from "jsonwebtoken";



export default async function registerUserController(req,res) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(!name || !email || !password){
            return res.status(400).json({
                message:"provide email,name,password",
                error:true, 
                success:false
            })
        }

        const user = await User.findOne({email:email})
        if(user){
            return res.send({
                message:"already registerd user",
                error: true,
                success: false
            })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password,salt);

        const payload = {
            name,
            email,
            password:hasedPassword
        }

        const newUser = new User(payload);
        const save = await newUser.save();

        const  verifyEmailUrl = `${process.env.BASE_URL}/verify-email?code=${save._id}`

        const verifyEmail = await sendEmail({
            sendTo:email,
            subject:"verification Email for your Account",
            html:verificatioEmailTemplate({
                name,
                url:verifyEmailUrl
                
            })
        })
      

        return res.json({   
            message:"User registerd successFully",
            error:false,
            success:true,
            data:save
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            error: true,
            success:false
        })
    }
}


export async function verifyEmailController(req,res){
    try {
        const { code } = req.body;
        
        const user = await  User.findOne({_id:code})

        if(!user){
               return res.status(400).josn({
                   message:"Invalid Code",
                   error : true,
                   
               })
        }
        const updateUser = await User.updateOne({_id:code},{
            verify_email:true
        })

        return res.json({
            message: "Email verified",
            success:true,
            error:false
        })
    } catch (error) {
        return res.status(500).josn({
            message:error,
            error:true,
            success:true
        })    
    }
}

//login controller

export async function userLoginController(req,res){
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"please provide email and password",
                error:true, 
                success:false
            })
        }
        const user = await User.findOne({email:email});

        if(!user){
           return res.status(400).json({
                message: "user not registered",
                error:true,
                success:false
            })
        }
        if(user.status !== "active"){
            return res.status(400).json({
                message: "contact to admin",
                error:true,
                success:false
            })
        }

        const checkPassword = await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return res.status(400).json({
                message:"check your password",
                error:true,
                success:false
            })
        }
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generaterefreshToken(user._id);

        const updateUserDetails = await User.findByIdAndUpdate(user?._id,{
            last_login_date:new Date()
        })
        const cookieOptions = {
            httponly:true,  
            secure:true,
            sameSite:"None"
        }
        res.cookie('accessToken',accessToken,cookieOptions);
        res.cookie('refreshToken',refreshToken,cookieOptions);
        return res.send({
            message :"Login SuccessFully",
            error:false,
            success:true,
            data : {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}
//logout Controller
export async function logOutController(req,res){
    try {
        const userId = req.userId;
         const cookieOptions = {
            httponly:true,  
            secure:true,
            sameSite:"None"
        }
        res.clearCookie("accessToken",cookieOptions);
        res.clearCookie("refreshToken",cookieOptions);

        const removerefreshToken = await User.findByIdAndUpdate(userId,{
            refresh_token : ""
        })

        return res.status(200).json({
            message:"Logout SuccessFully",
            error:"false",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            error:error,
            success:false,
            error:true
        })
    }
}

//upload user image
export async function uploadAvtar(req,res) {
        try {

            const userId = req.userId // auth MiddleWare
            const image = req.file; // multer Middlware

            const upload = await uploadImageCloudinary(image);
            console.log(upload);
            

            const updateUser = await User.findByIdAndUpdate(userId,{
                avatar:upload.url
            })
            return res.status(200).json({
                message:"Upload Profile",
                success:true,
                error:false,
                data :{
                    _id : userId ,
                    avatar : upload.url
                }
            })
        } catch (error) {
            return res.status(500).json({
                message:error.message || error,
                error:error,
                success:true 
            })
        }
}

export async function UpdateUserprofileInformation(req,res){
    try {
        const userId = req.userId; // auth middleware
        const { name,email,mobile,password } = req.body;
        console.log(name,email,password,mobile);
        

        let hasedPassword = "";
        if(password){
            const salt = await bcrypt.genSalt(10);
            hasedPassword = await bcrypt.hash(password,salt);
        }
        const updateuser = await User.updateOne({_id:userId},{
                ...(name && {name:name}),
                ...(email && {email:email}),
                ...(mobile && {moblie:mobile}),
                ...(password && {password:hasedPassword})
            })  
           
         return res.json({
            message :"Updated User profile successFully",
            data : updateuser,
            error:false,
            success:true
         }) 

    } catch (error) {
         return res.json({
            message:error.message || error,
            error:true,
            success:false
         })
    }
}


export async function forgotPassword(req,res){
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
          return res.status(400).json({
                message:"Email not available",
                error:true,
                success:false
            })
        }

        const otp = generateOtp();
        const expireTime = new Date() + 60 * 60 * 1000; //for 1h
        
        const update = await User.findByIdAndUpdate(user._id,{
            forgot_password_otp:otp,
            forgot_password_expiry: new Date(expireTime).toString()
        })
        await sendEmail({
            sendTo:email,
            subject:"Forgot password blinkit",
            html:forgotpasswordTemplate({
                name:user.name,
                otp:otp

            })
        })
        return res.json({
            message:"otp sent Check your email",
            error:false,
            success:true   
        })
    } catch (error) {
        res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export async function verifyForgotPassword(req,res){
    try {
        const {email,otp} = req.body;
        const user = await User.findOne({email})

        if(!email || !otp){
            return res.status(400).json({
                message:"provide required Fields",
                error:true,
                success:false
            })
        }

        if(!user){
            return res.status(400).json({
                message:"Email is not available",
                error:true,
                success:false
            })
        }
        const currentTime = new Date().toString();
        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message:"Otp is Expired",
                error:true,
                succes:fail
            })
        }
        if(otp !== user.forgot_password_otp){
            return res.status(400).json({
                message:"Invalid Otp",
                error:true,
                succes:false
            })
        }
        //if OTP is not Expires 
        // also 
        // OTP === user.forgot_password_otp
        const updateUser = await User.findByIdAndUpdate(user?._id,{
            forgot_password_otp:"",
            forgot_password_expiry:""
        })
        return res.status(200).json({
            message:"verify OTP successFully",
            error:false,
            succes:true 
        })
    } catch (error) {
        return res.status(500).json({
            message:error || error,
            error:true,
            success:false
        })
    }
}

export async function resetPassword(req,res){
    try {
        const { email,newPassword,confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message:"Provide Required field like email,newpassword,confiremdpassword"
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Email is Not Avilable",
                error:true,
                succes:false
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message:"Newpassword and confiremPassword are not same",
                error:true,
                succes:false 
            })
        }


            const salt = await bcrypt.genSalt(10);
           const hasedPassword = await bcrypt.hash(newPassword,salt);
       

        const update = await User.findOneAndUpdate(user._id,{
            password:hasedPassword
        })

        return res.json({
            message:"password updated SuccessFully",
            error:false,
            succes:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false 
        })
    }
}

export async function refreshToken(req,res){
    try {
        const refreshToken = req?.cookies?.refreshToken || req?.headers?.authorization?.split(" ")[1];

        if(!refreshToken){
            return res.status(401).json({
                message:"Invalid Token",
                error:true,
                succes:false

            })
        }
        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN);
        if(!verifyToken){
            return res.status(401).json({
                message:"Token is Expired",
                error:true,
        succes:false            
    })
}   
        console.log("veryfyToken",verifyToken._id);
        
        const userId = verifyToken?._id;
        const newAccessToken = await generateAccessToken(userId);
        
        const cookieOptions = {
            httponly:true,  
            secure:true,
            sameSite:"None"
        }

        res.cookie("accessToken",newAccessToken,cookieOptions);

        return res.json({
            message:"New accessToken Generated",
            error:false,
            success:true,
            data:{
                accessToken: newAccessToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message || error,
            error:true,
            succes:false
        })
    }
}

//get Login user details

export async function LoginUserDetails(req,res) {
    try {
        const userId = req.userId;
        console.log("UserID",userId );        
        const user = await User.findById(userId).select('-password -refresh_token');
        return res.status(200).json({
            message:"User Details",
            data:user,
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            error:error,
            message:"Somthing gone Wrong"
        })
        
    }
}