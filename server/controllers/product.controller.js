import Product from "../models/product.model.js";


export const CreateProductController = async(req,res)=>{
    try {
        console.log(req.body)
        const {
        name,
        Image,
        category,
        sub_category,
        unit,
        stock,
        price,
        discount,
        desecription,
        more_details} = req.body;
        
        console.log("Images:", Image); // Debug Images
        console.log("Subcategories:", sub_category);

        if(!name || !Image?.length || !category?.length || !sub_category?.length || !unit || !price || !desecription){
        return res.status(400).json({
            message: "Enter Required Fields",
            error: true,
            success: false
        })
    }

        const product = new Product({
            name,
            Image,
            category,
            sub_category,
            unit,
            stock,
            price,
            discount,
            desecription,
            more_details
        })

        const SaveProduct = await product.save();
        
        return res.json({
            message: "Product Created SuccessFully",
            data: SaveProduct ,
            error: false,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            success:false,
            message: error.message || error || "Something went wrong"
        })
    }
}


export const getProductController = async(req,res)=>{
    try {
        let  {page,limit,search} = req.body;
        if(!page){
            page=1
        }
        if(!limit){
            limit = 10
        }
        const query = search ? {
            $text:{
                $search : search
               
            }
        }:{}
        const skip = (page -1) * limit;
        const [data,totalCount] = await Promise.all([
            Product.find(query).sort({createdAt:-1}).skip(skip).limit(limit).populate("category sub_category"),
            Product.countDocuments(query)
        ])

        return res.json({
            message:"Product Data",
            error:false,
             success:true,
             totalCount:totalCount,
             totalpages:Math.ceil(totalCount/limit),
             data:data
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Somting went Wrong" || error,
            success: false
        })
    }
}


export const getProductByCategory = async(req,res)=>{
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                message:"Provide category",
                error:true,
                success:false
            })
        }

        const product = await Product.find({
            category:{$in:id}
        }).limit(15)
        
return res.json({
    message:"Category product List ",
    data:product,
    error:false,
    success:true
})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            success:false,
            message: error.message || error || "Something went wrong"
        })
    }
}


export const getProductByCategoryandSubcategory = async(req,res)=>{
    try {
       const {categoryId,subCategoryId ,page,limit} = req.body;
       
       if(!categoryId || !subCategoryId){
            return res.status(400).json({
                message: "Provide SubCategoryId and CategoryId",
                error:true,
                success:false
            })
       }

       // Fix: Proper default value assignment
       const pageNumber = page || 1;
       const limitNumber = limit || 10;

       const query = {
         category : {$in : categoryId} ,
         sub_category : {$in : subCategoryId}
       }

       const skip = (pageNumber - 1) * limitNumber

      
       const [data,dataCount] = await Promise.all([
            Product.find(query).sort({createdAt:-1}).skip(skip).limit(limitNumber),
            Product.countDocuments(query)
       ])

       return res.json({
        message : "Product list",
        data:data,
        totalCount:dataCount,
        page:pageNumber,
        limit:limitNumber,
        success:true,
        error:false
        })

    } catch (error) {
     
        return res.status(500).json({
            message: error.message || "Something went wrong",
            error:true,
            success:false
        })
    }
}


export const getProdctDetails = async(req,res)=>{
    try {
        const {productId} = req.body;


        const ProductData = await Product.findOne({_id:productId});

        return res.json({
            message:"Product Details",
            data:ProductData,
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error:true,
            success:false,
        })
    }
}

export const updateProductDetails = async(req,res)=>{
    try {
        const {_id} = req.body;
        
        if(!_id){
            return res.status(400).json({
                message : "Provide Product id",
                error:true,
                success:false
            })
        }
        const updateProduct = await  Product.updateOne({_id:_id},{
            ...req.body
        })

        return res.json({
            message: "Update Product SuccessFully",
            data:updateProduct,
            error:false,
            success:true    
        })
    } catch (error) {
      
        return res.status(500).json({
         
            message: "Something went wrong",
            error:true,
            success:false
        })
    }
}


export const deleteProductDetails = async (req,res)=>{
    try {
        const { _id } = req.body;

        if(!_id){
            return res.status(400).json({
                message:"Provide Product Id",
                error:true,
                success:true
            })
        }

        const deleteProduct = await Product.deleteOne({_id : _id});

        return res.json({
            message:"Product Deleted SuccessFully",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            success:false,
            message: error || error.message || "Something went wrong"
        })
    }
}


export const searchProduct = async (req, res) => {
    try {
        let { search, page, limit } = req.body;
        
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }

        page = parseInt(page);
        limit = parseInt(limit);

        // Build search query
        const query = search ? {
            $text: {
                $search: search
            }
        } : {};

        const skip = (page - 1) * limit;

        const [data, dataCount] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category sub_category'),
            Product.countDocuments(query)
        ]);

        return res.json({
            message: "Product Data",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            page: page, 
            totalPage: Math.ceil(dataCount / limit)
        });

    } catch (error) {
        console.error('Search Product Error:', error); // Add logging for debugging
        return res.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
};