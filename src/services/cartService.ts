import cartModel, { CartStatus } from "../models/cartModel.js";
import productModel from "../models/productModel.js";

interface CreateCartParams {
    userId: string;
}

export const createCart = async (params: CreateCartParams) => {
    const cart = await cartModel.create({
        userId: params.userId,
        items: [],
        totalPrice: 0,
        status: CartStatus.ACTIVE,
    });
    return {
        success: true,
        message: 'Cart created',
        data: cart,
    };
}

interface GetActiveCartParams {
    userId: string;
}

export const getActiveCart = async (params: GetActiveCartParams) => {
    let cart = await cartModel.findOne({ userId: params.userId, status: CartStatus.ACTIVE });
    if (!cart) {
        const createResult = await createCart({ userId: params.userId });
        cart = createResult.data;
    }
    return {
        success: true,
        message: 'Cart found',
        data: cart,
    };
}

interface AddItemToCartParams {
    userId: string;
    productId: string;
    quantity: number;
}

export const addItemToCart = async (params: AddItemToCartParams) => {
    const cart = await getActiveCart({ userId: params.userId });
    if (!cart) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    const existsInCart = cart.data?.items.find((item) => item.product.toString() === params.productId);
    if (existsInCart) {
        return {
            success: false,
            message: 'Item already in cart',
            data: null,
        };
    }
    const product = await productModel.findById(params.productId);
    if (!product) {
        return {
            success: false,
            message: 'Product not found',
            data: null,
        };
    }
    if (!cart.data) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    if (params.quantity > product.stock) {
        return {
            success: false,
            message: 'Quantity is greater than stock',
            data: null,
        };
    }
    const item = {
        product: product._id,
        unitPrice: product.price,
        quantity: params.quantity,
    } as any;
    cart.data.items.push(item);
    cart.data.totalPrice += product.price * params.quantity;
    product.stock -= params.quantity;
    await product.save();
    await cart.data.save();
    return {
        success: true,
        message: 'Item added to cart',
        data: cart.data,
    };
}