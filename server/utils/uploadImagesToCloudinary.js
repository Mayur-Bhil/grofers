import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME_CLOUDINARY,
    api_key:process.env.API_KEY_CLOUDINARY,
    api_secret:process.env.API_SECRET_CLOUDINARY
    
})

const uploadImageCloudinary = async(image) =>{
    const buffer  = image?.buffer || Buffer.from(await image.arrayBuffer());

    const upladImage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({folder:"blinkit"},(error,uploadResult)=>{
               return resolve(uploadResult) 
        }).end(buffer)
    })
    return upladImage;  
}


export default uploadImageCloudinary;