import express from "express";
import ProductManagerMongo from "../dao/productManager.js";
import CartManager from '../dao/cartManager.js';
import { auth } from '../middlewares/auth.js';


const router = express.Router();
const productManager = new ProductManagerMongo("productos.json");
const cartManager = new CartManager("carts.json");

//ruta para registro
router.get('/',(req,res)=>{

    res.status(200).render('home', {login:req.session.usuario})
})

router.get('/registro',(req,res)=>{

    res.status(200).render('registro', {login:req.session.usuario})
})

router.get('/login',(req,res)=>{

    res.status(200).render('login', {login:req.session.usuario})
})

router.get('/perfil', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.status(200).render('perfil', {usuario, login:req.session.usuario})
})


// Ruta para la vista home
router.get("/productos", async (req, res) => {
    const usuario = req.session.usuario;
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
            login:req.session.usuario,
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            usuario
        });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ status: "error", error: "Error al obtener datos" });
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
