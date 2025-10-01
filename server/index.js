import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/user.route.js"
import CategoryRouter from "./routes/Category.route.js"
import uploadRouter from "./routes/upload.Route.js"
import subCategoryRouter from "./routes/subCategory.route.js"
import ProductRouter from "./routes/Product.route.js"
import cartRouter from "./routes/Cart.Route.js"
import addressRouter from "./routes/Address.route.js"
import orderRouter from "./routes/Order.route.js"
import adminRouter from "./routes/admin.route.js"
const app =  express();

app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy:false
}))

const port = 8080 || process.env.port

app.get("/",(req,res)=>{
    res.json({
        message:"hi there"
    })
})
app.use("/api/user",userRouter);
app.use("/api/category",CategoryRouter);
app.use("/api/file",uploadRouter);
app.use("/api/sub-category",subCategoryRouter);
app.use("/api/product",ProductRouter);
app.use("/api/cart",cartRouter);
app.use("/api/address",addressRouter);
app.use("/api/order",orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", orderRouter);

connectDB().then(()=>{

    app.listen(port,( )=>{
    console.log(`server is running on port ${port}`);
    console.log("Connected to DB successFully");
    })
}).catch((error)=>{
    console.log("connection error", error);
    
})
