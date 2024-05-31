import express from "express";
import ProductManagerMongo from "../dao/productManager.js";
import CartManager from '../dao/cartManager.js';
import { auth } from '../middlewares/auth.js';
import passport from "passport";
import { checkAuth, passportCall } from "../utils.js";
import { genSaltSync } from "bcrypt";
import ProductosController from "../controller/productos.controller.js";


const router = express.Router();
const productManager = new ProductManagerMongo("productos.json");
const cartManager = new CartManager("carts.json");

//ruta para registro
router.get('/', checkAuth, auth(["public"]), (req,res)=>{

    // const isAuthenticated = req.user ? true : false;
    // const isAuthenticated = req.isAuthenticated;
    const isAuthenticated = req.user ? true : false;


    res.status(200).render('home', {isAuthenticated})

})

router.get('/registro', checkAuth, auth(["public"]), (req,res)=>{

    const isAuthenticated = req.user ? true : false;

    res.status(200).render('registro', {isAuthenticated})
})

router.get('/login',checkAuth, auth(["public"]), (req,res)=>{

    const isAuthenticated = req.user ? true : false;

    res.status(200).render('login', {isAuthenticated})
})

router.get('/perfil', passportCall("jwt"), auth(["user", "admin"]), (req,res)=>{

    const isAuthenticated = req.user ? true : false;

    let usuario=req.user

    res.status(200).render('perfil', {isAuthenticated, usuario})
})

// Ruta para la vista home
router.get("/productos", checkAuth, ProductosController.getAllProductsPaginate)
//  router.get("/productos", checkAuth, async (req, res) => {
//      const isAuthenticated = req.user ? true : false;
//      let usuario=req.user
//      try {
//          let { pagina } = req.query;
//          if (!pagina) {
//              pagina = 1;
//          }
//          console.log("Página recibida:", pagina);
//          const {
//              products,
//              totalPages,
//              prevPage,
//              nextPage,
//              hasPrevPage,
//              hasNextPage
//          } = await productManager.getProducts({ limit: 10, page: pagina }); // Pasamos la página dinámica aqu
//          res.setHeader('Content-Type', 'text/html');
//          res.status(200).render("productos", {
//              isAuthenticated,
//              products,
//              totalPages,
//              prevPage,
//              nextPage,
//              hasPrevPage,
//              hasNextPage,
//              usuario
//          });
//      } catch (error) {
//          console.error("Error al obtener datos:", error);
//          res.status(500).json({ status: "error", error: "Error al obtener datos" });
//      }
//  })

router.get("/product/:pid", ProductosController.getProductById);



// Ruta para agregar un producto al carrito
router.post("/products/:pid/add-to-cart", passportCall("jwt"), auth(["user", "admin"]), ProductosController.ProductIdAddToCart)
// router.post("/products/:pid/add-to-cart", async (req, res) => {
//     const productId = req.params.pid;
//     const cartId = req.body.cartId || "0";  // Valor por defecto si no se envía

//     try {
//         console.log("Agregando producto al carrito. ProductId:", productId, "CartId:", cartId);

//         // Verificar si el producto está disponible
//         const product = await productManager.getProductById(productId);
//         if (!product) {
//             return res.status(404).send("Producto no encontrado");
//         }
//         if (product.stock === 0) {
//             return res.status(400).send("Producto no disponible en stock");
//         }

//         // Obtener el carrito correspondiente
//         let cart = await cartManager.getOrCreateCart(cartId);

//         // Verificar si el producto ya está en el carrito
//         if (!cart.products.includes(productId)) {
//             cart.products.push(productId);  // Agregar el ObjectId del producto
//         }

//         // Actualizar el carrito en el almacenamiento persistente
//         cart = await cartManager.updateCart(cart);
//         console.log("Carrito después de agregar producto:", cart);

//         res.status(200).send("Producto agregado al carrito exitosamente");
//     } catch (error) {
//         console.error("Error al agregar el producto al carrito:", error);
//         res.status(500).send("Error al agregar el producto al carrito: " + error.message);
//     }
// });

router.get('/cart/:cartId', async (req, res) => {
    try {
        const cart = await cartManager.getOrCreateCart(req.params.cartId);
        res.render('cart', { cart });
    } catch (error) {
        res.status(404).send('Carrito no encontrado');
    }
});

export default router;
