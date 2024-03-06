import express from "express";
import productsRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import path from "path";
import handlebars from express-handlebars
import vistasRouter from "./routes/views.router.js";
import Server from 'socket.io';


const app = express();
const port = 8080;

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

// Socket.io - Manejar conexiones
io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
    // Websocket

    const io = new Server(server);
    socket.on('productAdded', (product) => {
      io.emit('updateProducts', productManager.getProducts());
    });
  
    socket.on('productDeleted', (productId) => {
      io.emit('updateProducts', productManager.getProducts());
    });
  
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
  

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});



