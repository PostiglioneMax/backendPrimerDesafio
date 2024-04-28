import express from "express";
import {CartManager} from "../dao/cartManager.js";

const router = express.Router();
const cartManager = new CartManager();

// Obtener o crear un carrito por ID
router.get("/:cartId", async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await cartManager.getOrCreateCart(cartId);
        res.render("cart", { cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto al carrito
router.post("/:cartId/add", async (req, res) => {
    const { cartId } = req.params;
    const { productId } = req.body;
    try {
        const cart = await cartManager.addProductToCart(cartId, productId);
        res.redirect(`/cart/${cart._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto del carrito
router.delete("/:cartId/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        const cart = await cartManager.deleteProductFromCart(cartId, productId);
        res.redirect(`/cart/${cart._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cartId", async (req, res) => {
    const { cartId } = req.params;
    const { products } = req.body;
    try {
        const cart = await cartManager.updateCart(cartId, products);
        res.redirect(`/cart/${cart._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar la cantidad de ejemplares del producto en el carrito
router.put("/:cartId/:productId/quantity", async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.redirect(`/cart/${cart._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cartId", async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await cartManager.clearCart(cartId);
        res.redirect(`/cart/${cart._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
