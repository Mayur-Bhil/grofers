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

const app = express();

// CORS configuration - allow both local and production URLs
const allowedOrigins = [
    process.env.BASE_URL,
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // For deployment, you might want to be more restrictive
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

const port = process.env.PORT || 8080;

// Connect to database
connectDB().catch((error) => {
    console.log("Database connection error:", error);
});

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "API is running successfully",
        status: "ok"
    });
});

app.use("/api/user", userRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Export for Vercel serverless
export default app;