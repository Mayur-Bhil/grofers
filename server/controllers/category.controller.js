import Category from "../models/category.model.js"
import subCategory from "../models/subCategory.model.js";
import Product from "../models/product.model.js";


export const UploadCategoryController = async(req,res)=>{
    try {
        const {name,image} = req.body;
        if(!name || !image){
            return res.status(400).json({
                message:"Enter Required fields",
                error:true,
                success:false
            })
        }

        const AddTocategory = new Category({
            name,
            image
        })
        const saveCategory = await AddTocategory.save();
        

        if(!saveCategory){
            return res.status(400).json({
                message: "not created Category",
                error:true,
                success:false
            })
        }

        return res.json({
            message:"added Category",
            data:saveCategory,
            success:true,
            error:false
        })
    } catch (error) {
       res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
       })
    }
}


export const getCategoryController = async (req,res)=>{
    try {
        const data = await Category.find().sort({createdAt:-1});

        return res.json({
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export const updateCategoryController = async (req,res)=>{
    try {
        const { _id,name,image } = req.body;
        const update = await Category.updateOne({
            _id:_id,
        },{
            name,
            image
        })
        if(update.matchedCount === 0) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }
        
        // Make sure you're returning status 200 (success)
        return res.status(200).json({  // Add explicit 200 status
            message: "Updated category",
            data: update,
            error: false,
            success: true
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false
        });
    }
}


export const deleteCategoryController = async(req,res)=>{
    try {
        const { _id } = req.body;
        const checkSUbCategory = await subCategory.find({
            category:{
                "$in" : [ _id ]
            }
        }).countDocuments()

        const checkProduct = await Product.find({
            category:{
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkSUbCategory>0 || Product>0){
            return res.status(400).json({
                message: "Categoty is Already in use",
                error:true,
                success:false
            })
        }
        const deleteCategory = await Category.deleteOne({
            _id:_id 
        })

        return res.json({
            message:"Deleted Category successFully",
            error:false,
            success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            success:false,
            message: error,
        })
    }
}