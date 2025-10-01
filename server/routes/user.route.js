import { Router } from "express";
import registerUserController, { forgotPassword,LoginUserDetails, logOutController, refreshToken, resetPassword, UpdateUserprofileInformation, uploadAvtar, userLoginController, verifyEmailController, verifyForgotPassword } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
const userRouter = Router();

userRouter.post("/register",registerUserController);
userRouter.post("/verify-email",verifyEmailController);
userRouter.post("/login",userLoginController);
userRouter.get("/logout",auth,logOutController);
userRouter.put("/upload-avatar",auth,upload.single('avatar'),uploadAvtar);
userRouter.put("/update-user",auth,UpdateUserprofileInformation);
userRouter.post("/forgot-password",forgotPassword);
userRouter.put("/verify-otp",verifyForgotPassword);
userRouter.put("/reset-password",resetPassword);
userRouter.post("/refresh-token",refreshToken);
userRouter.get("/user-details",auth,LoginUserDetails);

export default userRouter;
