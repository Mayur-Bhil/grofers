import { Router } from "express";
import auth from "../middlewares/auth.js";
import { deleteCategoryController, getCategoryController, updateCategoryController, UploadCategoryController } from "../controllers/category.controller.js";
const CategoryRouter = Router();

CategoryRouter.post("/add-category",auth,UploadCategoryController); 
CategoryRouter.get("/get",getCategoryController);
CategoryRouter.put("/update",auth,updateCategoryController);
CategoryRouter.delete("/delete",auth,deleteCategoryController);





export default CategoryRouter;