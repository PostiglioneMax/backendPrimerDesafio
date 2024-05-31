import express from 'express';
import ProductManagerMongo from '../dao/productManager.js';
import ProductosController from "../controller/productos.controller.js";



const router = express.Router();
const productManager = new ProductManagerMongo();

// Obtener todos los productos
router.get('/', ProductosController.getProducts)
// router.get('/', async (req, res) => {
//     try {
//         const products = await productManager.getProducts();
//         console.log(products);
//         res.status(200).json({ status: 'success', payload: {products} });
//     } catch (error) {
//         res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
//     }
// });

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
// router.get('/:pid', async (req, res) => {
//     try {
//         const product = await productManager.getProductById(req);
//         res.status(200).json({ status: 'success', payload: product });
//     } catch (error) {
//         res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
//     }
// });

// Agregar un nuevo producto
router.post('/addProduct', ProductosController.addProduct)
// router.post('/', async (req, res) => {
//     let { title, description, price, category } = req.body;
//     if (!title || !description || !price || !category) {
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(400).json({ error: "faltan datos obligatorios" });
//     }

//     try {
//         let nuevoProducto = await productManager.addProduct({ title, description, price, category });
//         console.log(nuevoProducto);
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(201).json({ payload: nuevoProducto });
//     } catch (error) {
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(500).json({ error: error.message });
//     }
// });


// Actualizar un producto por ID
router.put('/:pid', ProductosController.updateProduct)
// router.put('/:pid', async (req, res) => {
//     try {
//         const product = await productManager.updateProduct(req);
//         res.status(200).json({ status: 'success', message: 'Producto actualizado correctamente', payload: product });
//     } catch (error) {
//         res.status(500).json({ status: 'error', error: 'Error al actualizar producto' });
//     }
// });

// Eliminar un producto por ID
router.delete('/:pid', ProductosController.deleteProduct)
// router.delete('/:pid', async (req, res) => {
//     try {
//         await productManager.deleteProduct(req);
//         res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
//     } catch (error) {
//         res.status(500).json({ status: 'error', error: 'Error al eliminar producto' });
//     }
// });

export default router;
