import express from "express";
import { getAllProducts } from "../services/productService.js";
import { addItemToCart, getActiveCart } from "../services/cartService.js";
import validateJWT from "../middleware/validateJWT.js";
import type { ExtendedRequest } from "../types/extendedRequest.ts";

const router = express.Router();

router.get('/', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const cart = await getActiveCart({ userId: userId.toString() });
        res.status(cart.success ? 200 : 400).json({ message: cart.message, data: cart.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.post('/items', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }
        const item = await addItemToCart({ userId: userId.toString(), productId, quantity });
        res.status(item.success ? 200 : 400).json({ message: item.message, data: item.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding item to cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});


export default router;