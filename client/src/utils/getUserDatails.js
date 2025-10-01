import summeryApis from "../common/summuryApi";
import AxiosToastError from "./AxiosToastError";
import Axios from "./useAxios";

const getUserDetails = async()=>{
    try {
        const response = await Axios({
            ...summeryApis.userDetails
        })
        return response
    } catch (error) {
        AxiosToastError(error)
    }
}

export default getUserDetails;