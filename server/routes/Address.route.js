import { Router } from "express";
import auth from "../middlewares/auth.js";  
import { adddressCOntroller, deleteAddressController, getaddressController, updateAddressController } from "../controllers/Address.controller.js";  

const addressRouter = Router();


addressRouter.post("/create", auth, adddressCOntroller);
addressRouter.get("/get",auth,getaddressController);
addressRouter.put("/update",auth,updateAddressController);
addressRouter.delete("/dissable",auth,deleteAddressController);

export default addressRouter;