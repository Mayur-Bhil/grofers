import{ Router } from "express";
import auth from "../middlewares/auth.js";
import { addtoCartController, deleteCartItemQuantityCOntroller, getCartItemsController, updateCartItemQtyCOntroller } from "../controllers/cart.controller.js";
import { clearCartController } from "../controllers/order.controller.js";
const cartRouter = Router();


cartRouter.post("/create",auth,addtoCartController);
cartRouter.get("/get",auth,getCartItemsController);
cartRouter.put("/update-qty",auth,updateCartItemQtyCOntroller);
cartRouter.delete("/delete-cart-item",auth,deleteCartItemQuantityCOntroller);
cartRouter.post("/clear", auth, clearCartController);

export default cartRouter;