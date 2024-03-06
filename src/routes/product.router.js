import express from "express";
import ProductManager from "../../productManager.js";

const router = express.Router();
const productManager = new ProductManager("productos.json");

// Obtener todos los productos
router.get("/", (req, res) => {
    const limit = req.query.limit;
    const products = productManager.getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit, 10));
        res.json({ products: limitedProducts });
    } else {
        res.json({ products });
    }
});

// Obtener un producto por ID
router.get("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const product = productManager.getProductById(productId);
        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Agregar un nuevo producto
router.post("/", (req, res) => {
    try {
        const newProduct = productManager.addProduct(req.body);
        res.json({ product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto por ID
router.put("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const updatedProduct = productManager.updateProduct(productId, req.body);
        res.json({ product: updatedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar un producto por ID
router.delete("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const deletedProduct = productManager.deleteProduct(productId);
        res.json({ product: deletedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
