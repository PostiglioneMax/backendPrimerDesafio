import express from "express";
import ProductManager from "../../productManager.js";

const router = express.Router();

// Ruta para la vista home
router.get("/", (req, res) => {
    const products = productManager.getProducts();
    res.render("home", { products });
});

// Ruta para la vista realTimeProducts
router.get("/realtimeproducts", (req, res) => {
    const products = productManager.getProducts();
    res.render("realTimeProducts", { products });
});
