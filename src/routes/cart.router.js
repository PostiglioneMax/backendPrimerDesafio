import express from "express";

const router = express.Router();
const carts = [];

// Crear un nuevo carrito
router.post("/", (req, res) => {
    const newCart = {
        id: generateUniqueId(), // Asegurar que el id sea único
        products: [],
    };
    carts.push(newCart);
    res.json({ cart: newCart });
});

// Listar productos de un carrito por su ID
router.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
        res.json({ products: cart.products });
    } else {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

// add product to cart by id
router.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
        const existingProduct = cart.products.find((p) => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity,
            });
        }

        res.json({ cart: cart });
    } else {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

// fn for unique id
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default router;
