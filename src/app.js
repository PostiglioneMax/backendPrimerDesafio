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
// Importaciones de módulos propios
import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import vistasRouter from "./routes/views.router.js";
import ProductManagerMongo from "./dao/productManager.js";
import __dirname, { SECRET } from "./utils.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import { handleError } from "./middlewares/handleErrors.js";




const app = express();
const server = http.createServer(app);
const port = config.PORT;

const productManager = new ProductManagerMongo();

const io = new Server(server);
// Socket.io - Manejar conexiones
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Websocket

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride((req, res) => {
    console.log(`Overriding method: ${req.body._method}`);
    return req.body._method;
}));

app.use(cookieParser(SECRET))
//Session YA NO VA, MIGRA A JWT
// app.use(session(
//     {
//         secret:"CoderCoder123",
//         resave: true, saveUninitialized: true,
//         store: MongoStore.create(
//             {
//                 mongoUrl: "mongodb+srv://postisama22:maxi123@cluster0.hjmvuac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//                 ttl: 60
//             }
//         )
//     }
// ))
// 2) Inicializo passport y sus configuraciones en app.js
initPassport()
app.use(passport.initialize())
// app.use(passport.session())

//handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    handlebars: Handlebars,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./views");


// alta de contenido static
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/sessions", sessionsRouter);

// Route de productos
app.use("/api/products", productsRouter);

// Rutas del cart
app.use("/api/carts", cartRouter);

// Ruta para la vista home
app.use("/", vistasRouter);

app.use(handleError)

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


const connect = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            dbName: "DataBase",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Online!!...");
    } catch (error) {
        console.log("Fallo la conexion, detalle:", error.message);
    }
};

connect();
