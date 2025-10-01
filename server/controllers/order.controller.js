import mongoose from "mongoose";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import cartProduct from "../models/cartProduct.model.js";
import stripe from "../config/stripe.js"

export const CashOndeleveryOrderController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.userId;
        const {list_items, totalAmount, addressId, subTotalAmount} = req.body;

        // Validate required fields
        if (!list_items?.length || !addressId || !totalAmount) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }

        try {
            // Generate orderId
            const orderId = "OD" + Date.now() + Math.floor(Math.random() * 1000);

            // Create order
            const newOrder = await Order.create([{
                userId,
                orderId,
                list_items: list_items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    quantity: item.quantity,
                    price: item.price
                })),
                payment_method: "COD",
                payment_status: "PENDING",
                order_status: "PLACED",
                delivery_address: addressId,
                subTotalAmount,
                totalAmount
            }], { session });

            // Clear user's cart
            await Promise.all([
                User.findByIdAndUpdate(
                    userId,
                    { $set: { shopping_cart: [] } },
                    { session }
                ),
                cartProduct.deleteMany({ userId }, { session })
            ]);

            await session.commitTransaction();

            return res.status(200).json({
                message: "Order placed successfully",
                success: true,
                data: newOrder[0]
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        }

    } catch (error) {
        await session.abortTransaction();
        console.error("Order creation error:", error);
        return res.status(500).json({
            message: "Failed to place order",
            success: false
        });
    } finally {
        session.endSession();
    }
};

// Fix the price calculation function
export const priceWithDisCount = (price, discount = 0) => {
    const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100);
    return Math.round(Number(price) - discountAmount);
}

export const onlinePaymentController = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.userId;
        const {list_items, totalAmount, addressId, subTotalAmount} = req.body;

        // Input validation
        if (!list_items?.length || !addressId || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate orderId
        const orderId = `OD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        try {
            // Format line items for Stripe
            const line_items = list_items.map(item => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name,
                        images: [item.image].filter(Boolean),
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to paise
                },
                quantity: item.quantity,
            }));

            // Create Stripe session
            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: user.email,
                metadata: {
                    userId,
                    orderId,
                    addressId
                },
                line_items,
                success_url: `${process.env.BASE_URL}/success?orderId=${orderId}`,
                cancel_url: `${process.env.BASE_URL}/cancel`,
            });

            // Create order in DB with valid enum values
            await Order.create([{
                userId,
                orderId,
                list_items: list_items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    quantity: item.quantity,
                    price: item.price
                })),
                payment_method: "ONLINE",
                payment_status: "PENDING",
                order_status: "PLACED", // Changed from INITIATED to PLACED
                delivery_address: addressId,
                subTotalAmount,
                totalAmount,
                paymentId: stripeSession.id // Using paymentId instead of stripeSessionId
            }], { session });

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                url: stripeSession.url
            });

        } catch (stripeError) {
            throw new Error(stripeError.message);
        }

    } catch (error) {
        await session.abortTransaction();
        console.error("Payment Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment initialization failed"
        });
    } finally {
        session.endSession();
    }
};


export const updateOrderStatusController = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId } = req.params;
        const userId = req.userId;

        // Update order status and clear cart
        try {
            // Update order status
            const order = await Order.findOneAndUpdate(
                { orderId, userId },
                { 
                    $set: { 
                        payment_status: "COMPLETED",
                        order_status: "CONFIRMED"
                    }
                },
                { session, new: true }
            );

            if (!order) {
                throw new Error("Order not found");
            }

            // Clear user's cart
            await Promise.all([
                User.findByIdAndUpdate(
                    userId,
                    { $set: { shopping_cart: [] } },
                    { session }
                ),
                cartProduct.deleteMany({ userId }, { session })
            ]);

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Order completed successfully",
                data: order
            });

        } catch (error) {
            throw new Error(error.message);
        }

    } catch (error) {
        await session.abortTransaction();
        console.error("Order status update error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update order status"
        });
    } finally {
        session.endSession();
    }
};

export const clearCartController = async (req, res) => {
    try {
        const userId = req.userId;

        // Use transaction for data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Clear cart from both User and CartProduct collections
            await Promise.all([
                User.findByIdAndUpdate(
                    userId,
                    { $set: { shopping_cart: [] } },
                    { session }
                ),
                cartProduct.deleteMany({ userId }, { session })
            ]);

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Cart cleared successfully"
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error("Clear cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        });
    }
};

export const getUserOrdersController = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        // Get orders with pagination
        const orders = await Order.find({ userId })
            .populate('delivery_address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalOrders = await Order.countDocuments({ userId });
        const totalPages = Math.ceil(totalOrders / limit);

        return res.status(200).json({
            message: "Orders fetched successfully",
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({
            message: "Failed to fetch orders",
            success: false
        });
    }
};

// Get single order details
export const getOrderDetailsController = async (req, res) => {
    try {
        const userId = req.userId;
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false
            });
        }

        const order = await Order.findOne({ 
            orderId: orderId, 
            userId: userId 
        }).populate('delivery_address');

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Order details fetched successfully",
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Get order details error:", error);
        return res.status(500).json({
            message: "Failed to fetch order details",
            success: false
        });
    }
};

export const cancelOrderController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.userId;
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Find order in a transaction session
        const order = await Order.findOne({ orderId, userId }, null, { session });

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Only allow cancellation for certain statuses
        const cancellableStatuses = ["PLACED", "CONFIRMED"];
        if (!cancellableStatuses.includes(order.order_status)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled when status is ${order.order_status}`
            });
        }

        // Update order fields safely
        order.order_status = "CANCELLED";
        order.payment_status =
            order.payment_method === "ONLINE" ? "REFUNDED" : "CANCELLED";

        await order.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Cancel order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to cancel order"
        });
    } finally {
        session.endSession();
    }
};


// Track order status
export const trackOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false
            });
        }

        const order = await Order.findOne({ 
            orderId: orderId, 
            userId: userId 
        }).select('orderId order_status payment_status createdAt updatedAt');

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        // Create tracking timeline
        const trackingSteps = [
            { status: "PLACED", label: "Order Placed", completed: true },
            { status: "CONFIRMED", label: "Order Confirmed", completed: order.order_status !== "PLACED" },
            { status: "SHIPPED", label: "Shipped", completed: ["SHIPPED", "DELIVERED"].includes(order.order_status) },
            { status: "DELIVERED", label: "Delivered", completed: order.order_status === "DELIVERED" }
        ];

        return res.status(200).json({
            message: "Order tracking fetched successfully",
            success: true,
            data: {
                orderId: order.orderId,
                currentStatus: order.order_status,
                paymentStatus: order.payment_status,
                trackingSteps,
                lastUpdated: order.updatedAt
            }
        });

    } catch (error) {
        console.error("Track order error:", error);
        return res.status(500).json({
            message: "Failed to track order",
            success: false
        });
    }
};

// Add this function to your existing order.controller.js

export const getUserProfileWithOrdersController = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId)
            .select('-password')
            .populate('address_details')
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Get recent orders (last 5)
        const recentOrders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderId order_status payment_status totalAmount createdAt')
            .lean();

        // Add order_history to user object
        user.order_history = recentOrders;

        return res.status(200).json({
            message: "User profile fetched successfully",
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Get user profile error:", error);
        return res.status(500).json({
            message: "Failed to fetch user profile",
            success: false
        });
    }
};

// Enhanced webhook handler for Stripe payment completion
export const stripeWebhookController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        if (event.type === 'checkout.session.completed') {
            const session_data = event.data.object;
            const { userId, orderId, addressId } = session_data.metadata;

            // Update order status
            const updatedOrder = await Order.findOneAndUpdate(
                { orderId, userId },
                { 
                    $set: { 
                        payment_status: "COMPLETED",
                        order_status: "CONFIRMED",
                        paymentId: session_data.id
                    }
                },
                { session, new: true }
            );

            if (updatedOrder) {
                // Clear user's cart
                await Promise.all([
                    User.findByIdAndUpdate(
                        userId,
                        { $set: { shopping_cart: [] } },
                        { session }
                    ),
                    cartProduct.deleteMany({ userId }, { session })
                ]);
            }

            await session.commitTransaction();
        }

        res.status(200).json({ received: true });

    } catch (error) {
        await session.abortTransaction();
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    } finally {
        session.endSession();
    }
};