import express from "express";
import ProductManagerMongo from "../dao/productManager.js";
import CartManager from '../dao/cartManager.js';
import mongoose from 'mongoose';

const router = express.Router();
const productManager = new ProductManagerMongo("productos.json");
const cartManager = new CartManager("carts.json");
 

// Ruta para la vista home
router.get("/", async (req, res) => {
    try {
        let { pagina } = req.query;
        if (!pagina) {
            pagina = 1;
        }
        console.log("Página recibida:", pagina);
        const {
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        } = await productManager.getProducts({ limit: 10, page: pagina }); // Pasamos la página dinámica aquí

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("productos", { 
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ status: "error", error: "Error al obtener datos" });
    }
});




// Ruta para la vista de todos los productos con paginación
router.get("/products", async (req, res) => {
    try {
        const result = await productManager.getAllProducts(req.query);
        res.render("home", result);
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
});

router.get("/product/:pid", async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.status(200).render("detalle", { product });
    } catch (error) {
        res.status(500).send("Error al obtener el producto: " + error.message);
    }
});



// Ruta para agregar un producto al carrito

router.post("/products/:pid/add-to-cart", async (req, res) => {
    const productId = req.params.pid;
    const cartId = req.body.cartId || "0";  // Valor por defecto si no se envía

    try {
        console.log("Agregando producto al carrito. ProductId:", productId, "CartId:", cartId);

        // Verificar si el producto está disponible
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        if (product.stock === 0) {
            return res.status(400).send("Producto no disponible en stock");
        }

        // Obtener el carrito correspondiente
        let cart = await cartManager.getOrCreateCart(cartId);

        // Verificar si el producto ya está en el carrito
        if (!cart.products.includes(productId)) {
            cart.products.push(productId);  // Agregar el ObjectId del producto
        }

        // Actualizar el carrito en el almacenamiento persistente
        cart = await cartManager.updateCart(cart);
        console.log("Carrito después de agregar producto:", cart);

        res.status(200).send("Producto agregado al carrito exitosamente");
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error al agregar el producto al carrito: " + error.message);
    }
});

router.get('/cart/:cartId', async (req, res) => {
    try {
        const cart = await cartManager.getOrCreateCart(req.params.cartId);
        res.render('cart', { cart });
    } catch (error) {
        res.status(404).send('Carrito no encontrado');
    }
});

export default router;
