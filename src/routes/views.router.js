import express from "express";
import ProductManagerMongo from "../dao/productManager.js";
import CartManager from '../dao/cartManager.js';
import { auth } from '../middlewares/auth.js';
import { checkAuth, logger, passportCall } from "../utils.js";
import ProductosController from "../controller/productos.controller.js";
import { UsuariosMongoDAO as UsuariosDAO } from "../dao/usuariosMongoDAO.js";


const router = express.Router();
const productManager = new ProductManagerMongo("productos.json");
const cartManager = new CartManager("carts.json");
const usuariosDAO = new UsuariosDAO()

router.get('/', checkAuth, auth(["public"]), async (req,res)=>{
  
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

router.get('/perfil', passportCall("jwt"), auth(["user", "admin", "premium"]), (req,res)=>{

    const isAuthenticated = req.user ? true : false;

    let usuario=req.user

    res.status(200).render('perfil', {isAuthenticated, usuario})
})

router.get("/productos", checkAuth, ProductosController.getAllProductsPaginate)

router.get('/mockingproducts', ProductosController.getMockingProducts);

router.get("/product/:pid", ProductosController.getProductById, (req,res)=>{

    const isAuthenticated = req.user ? true : false;
    const usuario = req.user || null;

    res.status(200).render('detalle', {isAuthenticated, usuario})
});

router.post("/products/:pid/add-to-cart", passportCall("jwt"), auth(["user", "premium", "admin"]), ProductosController.ProductIdAddToCart)

router.get('/cart/:cartId', async (req, res) => {
  try {
      const cartId = req.params.cartId;
      const cart = await cartManager.getOrCreateCart(cartId);
      res.render('cart', { cart });
  } catch (error) {
      console.error(error);
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
