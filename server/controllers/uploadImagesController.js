import uploadImageCloudinary from "../utils/uploadImagesToCloudinary.js"

const uploadImageController = async(req,res) =>{
    try {
        const file = req.file
        const uploadImage = await uploadImageCloudinary(file);
        return res.json({
            message:"Image uploded successfully",
            success:true,
            data:uploadImage,
            error:false
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export default uploadImageController