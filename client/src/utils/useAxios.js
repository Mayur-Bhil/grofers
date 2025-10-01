import axios from "axios";
import summeryApis, { BASE_URL } from "../common/summuryApi";

const Axios =  axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})


//sendinig accessToken in the header
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken = localStorage.getItem("accessToken");
        
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//Extend Life Span oF accessToken

Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async (error) =>{
        let originalRequest = error.config

        if(error.response.status === 401 && !originalRequest.retry){
            originalRequest.retry = true
            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken){
                const NewaccessToken = await refreshAccessToken(refreshToken)
                if(NewaccessToken){
                    originalRequest.headers.Authorization = `Bearer ${NewaccessToken}`
                    return Axios(originalRequest)
                }
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken = async(refreshToken) =>{
    try {
        const response = await Axios({
            ...summeryApis.referesh_Token,
            headers:{
                Authorization:`Bearer ${refreshToken}`
            }
        })
        const accessToken = response.data.data.accessToken
        localStorage.setItem("accessToken",accessToken)
        return accessToken
        console.log(response);
        
    } catch (error) {
        console.log(error);
        
    }
}
export default Axios;