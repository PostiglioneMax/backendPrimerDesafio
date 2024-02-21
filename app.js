const express = require("express");
const ProductManager = require("./desafio02");

const app = express();
const port = 3000;

const productManager = new ProductManager("productos.json");

// para permitir el uso de JSON en las solicitudes
app.use(express.json());

// Endpoint para obtener todos los products con límite opcional
app.get("/products", (req, res) => {
    const limit = req.query.limit;
    const products = productManager.getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit, 10));
        res.json({ products: limitedProducts });
    } else {
        res.json({ products });
    }
});

// Endpoint para obtener un product por ID
app.get("/products/:pid", (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const product = productManager.getProductById(productId);

    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
