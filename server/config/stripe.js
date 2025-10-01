import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.STRIPE_API_KEY) {
    throw new Error('Missing STRIPE_API_KEY in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2023-10-16'
});

export default stripe;