import { Router } from "express";
import { getDashboardStats, getOrderAnalytics } from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.js";
import {admin} from "../middlewares/Admin.js";

const adminRouter = Router();

adminRouter.get("/dashboard-stats", auth, admin, getDashboardStats);
adminRouter.get("/order-analytics", auth, admin, getOrderAnalytics);

export default adminRouter;