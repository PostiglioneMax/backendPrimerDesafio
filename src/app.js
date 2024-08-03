import express from "express";
import http from "http";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import path from "path";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passport.config.js";
import methodOverride from "method-override";
import os from "os"
// Importaciones de módulos propios
import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import vistasRouter from "./routes/views.router.js";
import ProductManagerMongo from "./dao/productManager.js";
import __dirname, { SECRET, logger, middLogg } from "./utils.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import { handleError } from "./middlewares/handleErrors.js";
import swaggerSetup from "./config/swagger.js";




const app = express();
const server = http.createServer(app);
const port = config.PORT;

const productManager = new ProductManagerMongo();

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Cliente conectado");

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

//LOGGER
app.use(middLogg)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride((req, res) => {
    console.log(`Overriding method: ${req.body._method}`);
    return req.body._method;
}));

app.use(cookieParser(SECRET))

initPassport()
app.use(passport.initialize())

app.engine('handlebars', engine({
    defaultLayout: 'main',
    handlebars: Handlebars,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/sessions", sessionsRouter);

app.use("/api/products", productsRouter);

app.use("/api/carts", cartRouter);

app.use("/", vistasRouter);

app.use(handleError)

swaggerSetup(app);


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


const connect = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            dbName: "DataBase"
        });
        // logger.info("esto es mi cpu-----", os.cpus())
        // logger.info("esto es mi cpu-----", os.cpus().length)
        console.log("DB Online!!...");
        logger.error("ESTO ES UN fatal")
        // logger.error("ESTO ES UN error")
        // logger.warning("ESTO ES UN warning")
        // logger.info("SE INICIO EL SERVER")
        // logger.http("ESTO ES UN http")
        // logger.debug("ESTO ES UN DEBUG")

        console.log(config.MODE);
    } catch (error) {
        console.log("Fallo la conexion, detalle:", error.message);
    }
};

connect();

export default app