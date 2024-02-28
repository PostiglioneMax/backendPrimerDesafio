import express from "express";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de productos
app.use("/api/products", productsRouter);

// Rutas del cart
app.use("/api/carts", cartRouter);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
