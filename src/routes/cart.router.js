import express from "express";
import {CartManager} from "../dao/cartManager.js";
import CartController from "../controller/cart.controller.js"; 
import { checkAuth } from "../utils.js";
import { auth } from "../middlewares/auth.js";


const router = express.Router();
const cartManager = new CartManager();

// Obtener o crear un carrito por ID
router.get("/:cartId",CartController.getCartById)

// Agregar un producto al carrito
router.post("/:cartId/add", CartController.addProductToCart)

// Eliminar un producto del carrito
router.delete("/:cartId/:productId", CartController.deleteProductFromCart) 

// Actualizar el carrito con un arreglo de productos
router.put("/:cartId", CartController.updateCart)

// Actualizar la cantidad de ejemplares del producto en el carrito
router.put("/:cartId/:productId/quantity", CartController.updateProductQuantity)

// Eliminar todos los productos del carrito
router.delete("/:cartId", CartController.deleteAllProducts)

router.post('/:cid/purchase', checkAuth, auth(["user", "admin"]),CartController.cartPurchase)

export default router;
