import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        // Get overall statistics
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Get total revenue
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Get today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.find({
            createdAt: { $gte: today }
        });

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email')
            .populate('delivery_address');

        return res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalProducts,
                totalRevenue,
                todayOrders: todayOrders.length,
                todayRevenue: todayOrders.reduce((acc, order) => acc + order.totalAmount, 0),
                recentOrders
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dashboard stats"
        });
    }
};

export const getOrderAnalytics = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const orderStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last30Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    orders: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return res.status(200).json({
            success: true,
            data: orderStats
        });

    } catch (error) {
        console.error("Order analytics error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch order analytics"
        });
    }
};