import summeryApis from "../common/summuryApi"
import Axios from "./useAxios"

const uploadImages = async(image) =>{
    try {
        const formData = new FormData();
        formData.append("image",image)
        const res = await Axios({
            ...summeryApis.uploadImage,
            data:formData
        })
        return res;
    } catch (error) {
            return error;
    }   
}

export default uploadImages