import express from "express";
import ProductManagerMongo from "../dao/productManager.js";
import CartManager from '../dao/cartManager.js';
import { auth } from '../middlewares/auth.js';
import passport from "passport";
import { checkAuth, logger, passportCall } from "../utils.js";
import { genSaltSync } from "bcrypt";
import ProductosController from "../controller/productos.controller.js";


const router = express.Router();
const productManager = new ProductManagerMongo("productos.json");
const cartManager = new CartManager("carts.json");

//ruta para registro
router.get('/', checkAuth, auth(["public"]), async (req,res)=>{
//     const isAuthenticated = req.user ? true : false;
//     console.log("ESTO ES EL AUTHENTICATED....",isAuthenticated)
//     const usuario = req.user || null;
//     console.log("Usuario autenticado:", usuario);

//    res.status(200).render('home', {isAuthenticated, usuario})
const isAuthenticated = req.user;

  if (!req.isAuthenticated) {
    return res.render('home', { cart: null, isAuthenticated });
  }

  const cart = req.user.cart;

  if (cart && cart.products && cart.products.length > 0) {
    res.render('home', { cart, isAuthenticated });
  } else {
    res.render('home', { cart: null, isAuthenticated });
  }
});

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

router.get('/mockingproducts', ProductosController.getMockingProducts);

router.get("/product/:pid", ProductosController.getProductById, (req,res)=>{

    const isAuthenticated = req.user ? true : false;
    const usuario = req.user || null;


    res.status(200).render('detalle', {isAuthenticated, usuario})
});

// Ruta para agregar un producto al carrito
router.post("/products/:pid/add-to-cart", passportCall("jwt"), auth(["user"]), ProductosController.ProductIdAddToCart)
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

router.get('/error', (req,res)=>{

    throw new Error("Error de prueba")

    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

router.get('/error2', (req,res)=>{

    CustomError.createError({name:"Error de prueba", cause:"Estamos probando errores", message:"Prueba Errores", code: ERRORES.INDETERMINADO})

    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

router.get('/loggerTest', (req, res) => {
    req.logger.fatal('This is a fatal log');
    req.logger.error('This is an error log');
    req.logger.warning('This is a warning log');
    req.logger.info('This is an info log');
    req.logger.http('This is an http log');
    req.logger.debug('This is a debug log');
  
    res.send('Logger test completed. Check your logs.');
  });


export default router;
