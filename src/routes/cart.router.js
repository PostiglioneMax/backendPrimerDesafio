import express from "express";
import CartManager from "../dao/cartManager.js";

const router = express.Router();
const myCartManager = new CartManager("carts.json");

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try {
        const updatedCart = await myCartManager.removeProductFromCart(cartId, productId);
        res.json({ cart: updatedCart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
        const updatedCart = await myCartManager.updateCart(cartId, req.body.products);
        res.json({ cart: updatedCart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Actualizar la cantidad de ejemplares del producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const quantity = req.body.quantity;
    try {
        const updatedCart = await myCartManager.updateProductQuantity(cartId, productId, quantity);
        res.json({ cart: updatedCart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
        const deletedCart = await myCartManager.deleteCart(cartId);
        res.json({ cart: deletedCart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
