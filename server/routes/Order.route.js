import { Router } from "express";
import auth from "../middlewares/auth.js";
import { 
    cancelOrderController,
    CashOndeleveryOrderController, 
    getOrderDetailsController, 
    getUserOrdersController, 
    onlinePaymentController,
    trackOrderController,
    updateOrderStatusController 
} from "../controllers/order.controller.js";

const orderRouter = Router();
orderRouter.use(auth);
orderRouter.post("/cash-on-delivery", CashOndeleveryOrderController);
orderRouter.post("/checkout", onlinePaymentController);
orderRouter.post("/update-status/:orderId", updateOrderStatusController);
orderRouter.get("/user", getUserOrdersController);
orderRouter.get("/:orderId", getOrderDetailsController);
orderRouter.get("/track/:orderId", trackOrderController);
orderRouter.put("/cancel/:orderId", cancelOrderController);

export default orderRouter;