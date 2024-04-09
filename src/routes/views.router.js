import express from "express";
import ProductManager from "../dao/productManager.js";
import CartManager from "../dao/cartManager.js";

const router = express.Router();
const productManager = new ProductManager("productos.json");
const cartManager = new CartManager("carts.json");

// Ruta para la vista home
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAllProducts(req.query);
        res.render("home", { products });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});

// Ruta para la vista de todos los productos con paginación
router.get("/products", async (req, res) => {
    try {
        const products = await productManager.getAllProducts(req.query);
        res.render("products", { products });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});

// Ruta para la vista de un producto seleccionado
router.get("/products/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const product = await productManager.getProductById(productId);
        res.render("productDetail", { product });
    } catch (error) {
        res.status(404).send("Producto no encontrado");
    }
});

// Ruta para agregar un producto al carrito directamente
router.post("/products/:pid/add-to-cart", async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const cartId = req.body.cartId; // Suponiendo que el ID del carrito se envía en el cuerpo de la solicitud
    try {
        // Verificar si el producto está disponible
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        if (product.stock === 0) {
            return res.status(400).send("Producto no disponible en stock");
        }

        // Obtener el carrito correspondiente
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        // Agregar el producto al carrito
        cart.products.push({
            productId: product.id,
            quantity: 1,
        });

        // Actualizar el carrito en el almacenamiento persistente
        await cartManager.updateCart(cartId, cart.products);

        res.status(200).send("Producto agregado al carrito exitosamente");
    } catch (error) {
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

// Ruta para la vista de un carrito específico
router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
        const cart = await cartManager.getCartById(cartId);
        res.render("cartDetail", { cart });
    } catch (error) {
        res.status(404).send("Carrito no encontrado");
    }
});

export default router;
