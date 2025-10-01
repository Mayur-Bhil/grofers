import User from "../models/user.model.js"
export const admin = async(req,res,next) =>{
    try {
        const userId= req.userId;
        const user = await User.findById(userId);

        if(user.role !== "ADMIN"){
           return res.json({
                message: "Person denied" || error || error.message,
                error: true,
                success: false
            })
        }
        next()
    } catch (error) {
        onsole.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            error:true,
            sucess:true
        })
    }
}


