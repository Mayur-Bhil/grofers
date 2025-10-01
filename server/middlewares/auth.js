import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Access token is required. Please login to continue.",
                error: true,
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token. Please login again.",
                error: true,
                success: false
            });
        }

        req.userId = decode.id;
        next();

    } catch (error) {
        // Handle specific JWT errors for better user experience
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired. Please login again.",
                error: true,
                success: false
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token. Please login again.",
                error: true,
                success: false
            });
        }

        // Generic server error
        return res.status(500).json({
            message: "Authentication failed. Please try again.",
            error: true,
            success: false
        });
    }
};

export default auth;