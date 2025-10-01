import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

if(!process.env.DB_URI){
    throw new Error("Please provide DB_URI in the .env file");
    
}

export async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URI)
    } catch (error) {
        console.log("MOngoDB connection Error",error);
        process.exit();
        
    }   
}