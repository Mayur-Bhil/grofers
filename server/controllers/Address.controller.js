import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const adddressCOntroller = async(req, res) => {
    try {   
        const userId = req.userId; 
        
        // Destructure all required fields from req.body
        const { address_line, city, state, country, pincode, mobile } = req.body;

        // Validate required fields
        if (!address_line || !city || !state || !country || !pincode || !mobile) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        // Create new address
        const createAddress = new Address({
            address_line,
            city,
            state,
            country,
            pincode,
            mobile,
            userId : userId
        });

        const saveAddress = await createAddress.save();

        // Add address ID to user's address_details array
        const addUserAddressId = await User.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }
        });

        // Check if user was found and updated
        if (!addUserAddressId) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.status(201).json({
            message: "Address created successfully",
            error: false,
            success: true,
            data: saveAddress         
        });

    } catch (error) {
        console.error("Address creation error:", error);
        
        return res.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false  
        });
    }
};


export const getaddressController = async (req,res)=>{
    try {
        const userId = req.userId;

        const data = await Address.find({
            userId:userId
        })

        return res.json({
            data:data,
            message:"List Of address",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: error || error.message || "Something went wrong",
            error:true,
            success:false
        })
    }
}



export const updateAddressController = async(req,res)=>{
    try {
        const userId = req.userId;
        const {_id,address_line,city,state,country,pincode,mobile} = req.body;
        
        const updateAddress = await Address.updateOne({ _id: _id,userId:userId},{
            address_line,
            city,
            state,
            country,
            mobile,
            pincode
        })

        return res.json({
            message:"Updated Address Success Fully",
            error:false,
            success:true,
            data:updateAddress
        })
    } catch (error) {
        return res.status(500).json({
            
            message: error || error.message || "Something went wrong"
        })
    }
}

export const deleteAddressController = async(req,res)=>{
    try {
        const userId = req.userId;
        const {_id} = req.body;


        const dissAbleAddress  = await Address.updateOne({_id:_id,userId},{
            status:false
        })


        return res.json({
            message:"Address remove",
            error:false,
            success:true,
            data:dissAbleAddress
        })
    } catch (error) {
        return res.status(500).json({
            message: error ||error.message || "Something went wrong"
        })
    }
}