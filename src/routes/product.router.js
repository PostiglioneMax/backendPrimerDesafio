import express from 'express';
import ProductManagerMongo from '../dao/productManager.js';
import ProductosController from "../controller/productos.controller.js";
import { auth } from '../middlewares/auth.js';
import passport from 'passport';




const router = express.Router();
const productManager = new ProductManagerMongo();

// Obtener todos los productos
router.get('/', ProductosController.getProducts)

// Obtener todos los productos con paginación, filtros, etc.
router.get('/all', async (req, res) => {
    try {
        const products = await productManager.getAllProducts(req.query);
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});

// Obtener un producto por ID
router.get('/:pid', ProductosController.getProductById)

// Agregar un nuevo producto
router.post('/addProduct', passport.authenticate('jwt', { session: false }), auth(['premium', 'admin']), ProductosController.addProduct);

// Actualizar un producto por ID
router.put('/:pid', ProductosController.updateProduct)

// Eliminar un producto por ID
router.delete('/:pid', passport.authenticate('jwt', { session: false }), auth(['premium', 'admin']), ProductosController.deleteProduct);


export default router;
