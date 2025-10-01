import subCategory from "../models/subCategory.model.js";

export const addSubCategoryController = async(req,res)=>{
    try {
        const {name,image,category } = req.body;
        if(!name || !image || !category[0]){
            return res.status(400).json({
                message:"Provide Name ,image and categoty",
                error:true,
                success:false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubctegory = new subCategory(payload);
        const save = await createSubctegory.save();


        return res.status(200).json({
            message:"Sub Category Created successFully",
            data:save,
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}


export const getSubCategoryController = async(req,res)=>{
    try {
        const data = await subCategory.find().sort({createdAt:-1}).populate("category");
        return res.json({
            message:"SUbcategory Data",
            data:data,
            error:false,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            success:false,
            message: error || "Something went wrong"
        })
    }
}


export const UpdateSubcategory = async (req,res)=>{
    try {
        const { _id ,name,image,category} = req.body;

        const checkSUbcategory = await subCategory.findById(_id);

        if(!checkSUbcategory){
            return res.status(400).json({
                message:"Check your _id",
                error:true,
                success:false
            })
        }

        const updateSubcategory = await subCategory.findByIdAndUpdate(_id,{
            name,
            image,
            category
        },{
            new:true
        })

        return res.json({
            message:"Subcategory Updated SuccessFully",
            data:updateSubcategory,
            success:true,
            error:false
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            success:false,
            message: error.message | "Something went wrong"
        })
    }
}

export const deleteSubCategoryController = async(req,res)=>{
    try {
        const { _id } = req.body;
        const deleteSubCateory = await subCategory.findByIdAndDelete(_id);

        return res.status(200).json({
            message:"Deleted SuccessFully",
            error:false,
            data:deleteSubCateory,
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