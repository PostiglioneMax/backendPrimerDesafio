import express from 'express';
import ProductManagerMongo from '../dao/productManager.js';
import ProductosController from "../controller/productos.controller.js";
import { auth } from '../middlewares/auth.js';
import passport from 'passport';




const router = express.Router();
const productManager = new ProductManagerMongo();

router.get('/', ProductosController.getProducts)

router.get('/all', ProductosController.getProducts);

router.get('/:pid', ProductosController.getProductById)

router.post('/addProduct', passport.authenticate('jwt', { session: false }), auth(['premium', 'admin']), ProductosController.addProduct);

router.put('/:pid', ProductosController.updateProduct)

router.delete('/:pid', passport.authenticate('jwt', { session: false }), auth(['premium', 'admin']), ProductosController.deleteProduct);


export default router;
