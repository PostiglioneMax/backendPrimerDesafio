import express from "express";
import ProductManager from "../../productManager.js";

const router = express.Router();
const productManager = new ProductManager("productos.json");

// Obtener todos los productos
router.get("/", async (req, res) => {
    const limit = req.query.limit;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit, 10));
            res.json({ products: limitedProducts });
        } else {
            res.json({ products });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const product = await productManager.getProductById(productId);
        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.json({ product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        res.json({ product: updatedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const deletedProduct = await productManager.deleteProduct(productId);
        res.json({ product: deletedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
