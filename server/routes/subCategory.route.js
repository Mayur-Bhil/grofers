import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addSubCategoryController, deleteSubCategoryController, getSubCategoryController, UpdateSubcategory } from "../controllers/subCategory.controller.js";
const subCategoryRouter = Router();

subCategoryRouter.post("/create",auth,addSubCategoryController);
subCategoryRouter.post("/get",getSubCategoryController);
subCategoryRouter.put("/update",auth,UpdateSubcategory);
subCategoryRouter.delete("/delete",auth,deleteSubCategoryController);


export default subCategoryRouter;