import express from "express";
import productsRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import path from "path";
import http from "http";
import handlebars from "express-handlebars";
import vistasRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import __dirname from "./utils.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// alta de contenido static
app.use(express.static(path.join(__dirname, "/public")));

// Route de productos
app.use("/api/products", productsRouter);

// Rutas del cart
app.use("/api/carts", cartRouter);

// Ruta para la vista home
app.use("/", vistasRouter);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Socket.io - Manejar conexiones
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Websocket

    const io = new Server(Server);
    socket.on("productAdded", (product) => {
        io.emit("updateProducts", productManager.getProducts());
    });

    socket.on("productDeleted", (productId) => {
        io.emit("updateProducts", productManager.getProducts());
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://postisama22:maxi123@cluster0.hjmvuac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            dbName: "BasedeDatos",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Online!!...");
    } catch (error) {
        console.log("Fallo la conexion, detalle:", error.message);
    }
};

connect();
