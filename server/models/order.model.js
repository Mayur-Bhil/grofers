import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    list_items: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        },
        name: String,
        image: String,
        quantity: Number,
        price: Number
    }],
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "REFUNDED", "CANCELLED"],
        default: 'PENDING'
    },
    payment_method: {
        type: String,
        enum: ['COD', 'ONLINE'],
        default: 'COD'
    },
    order_status: {
        type: String,
        enum: ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PLACED'
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
        required: true
    },
    subTotalAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    invoice_receipt: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;