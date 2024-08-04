import express from "express";
import {CartManager} from "../dao/cartManager.js";
import CartController from "../controller/cart.controller.js"; 
import { checkAuth } from "../utils.js";
import { auth } from "../middlewares/auth.js";
import passport from "passport";


const router = express.Router();
const cartManager = new CartManager();

router.get("/:cartId", CartController.getCartById)

router.post("/:cartId/add", CartController.addProductToCart)

router.delete("/:cartId/:productId", CartController.deleteProductFromCart) 

router.put("/:cartId", CartController.updateCart)

router.put("/:cartId/:productId/quantity", CartController.updateProductQuantity)

router.delete("/:cartId", passport.authenticate('jwt', { session: false }), auth(['user','premium', 'admin']), CartController.deleteAllProducts)

router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), auth(["user", "admin", "premium"]),CartController.cartPurchase)

export default router;
