import { ProductosMongoDAO as ProductosDAO } from "../dao/productosMongoDAO.js";
import { CartMongoDAO as CartDAO } from "../dao/cartMongoDAO.js";
import { UsuariosMongoDAO as UsuariosDAO } from "../dao/usuariosMongoDAO.js";
import mongoose from "mongoose";

const usuariosDAO = new UsuariosDAO()
const cartDAO = new CartDAO()
const productosDAO = new ProductosDAO()

export default class ProductosController {

    static getProducts = async (req, res) => {
        try {
            const products = await productosDAO.getAllProducts();
            console.log(products);
            res.status(200).json({ status: 'success', payload: {products} });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
        }
    }

    static getProductById=async(req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productosDAO.getOneById(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.status(200).render("detalle", { product });
    } catch (error) {
        res.status(500).send("Error al obtener el producto: " + error.message);
    }
}

    static addProduct=async(req, res) => {
            let { title, description, price, category } = req.body;
    if (!title || !description || !price || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "faltan datos obligatorios" });
    }

    try {
        let nuevoProducto = await productosDAO.addProduct({ title, description, price, category });
        console.log(nuevoProducto);
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ payload: nuevoProducto });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    }
} 

static updateProduct=async(req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, category, availability } = req.body;

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (price) updatedFields.price = price;
        if (category) updatedFields.category = category;
        if (availability !== undefined) updatedFields.availability = availability;

        const updatedProduct = await productosDAO.updateOneProduct(pid, updatedFields);

        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        res.status(200).json({ status: "success", message: "Producto actualizado correctamente", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}

static deleteProduct=async(req, res) => {
    const productId = req.params.pid;
    try {
        await productosDAO.deleteProduct(productId);
        res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error al eliminar producto' });
    }
}

static getAllProductsPaginate = async (req, res) => {
    const isAuthenticated = req.user ? true : false;
    let usuario=req.user
    const { limit = 10, pagina = 1 } = req.query;   
    const options = {
        limit: parseInt(limit, 10),
        page: parseInt(pagina, 10),
        lean: true
    };
    try {
        if (!pagina) {
            pagina = 1;
        }
        console.log("Página recibida:", options.pagina);
        const {
            docs:
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        } = await productosDAO.getAllPaginate(options); // Pasamos la página dinámica aqu
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("productos", {
            isAuthenticated,
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
}

// static ProductIdAddToCart = async (req, res) => {
//     const productId = req.params.pid;
//         let cartId = req.body.cartId || "0";  // Valor por defecto si no se envía

//         try {
//             // Verificar si el producto está disponible
//             const product = await productosDAO.getOneById(productId);
//             if (!product) {
//                 return res.status(404).send("Producto no encontrado");
//             }
//             if (product.stock === 0) {
//                 return res.status(400).send("Producto no disponible en stock");
//             }

//             let cart;
//             if (cartId === "0" || !mongoose.Types.ObjectId.isValid(cartId)) {
//                 // Crear un nuevo carrito si no se ha proporcionado un cartId válido
//                 cart = await cartDAO.createCart({ products: [productId] });
//             } else {
//                 // Obtener el carrito correspondiente
//                 cart = await cartDAO.getOneById(cartId);
//                 if (!cart) {
//                     return res.status(404).send("Carrito no encontrado");
//                 }

//                 console.log("Agregando producto al carrito. ProductId:", productId, "CartId:", cartId);

//                 // Verificar si el producto ya está en el carrito
//                 if (!cart.products.some(p => p.equals(productId))) {
//                     cart.products.push(productId);  // Agregar el ObjectId del producto
//                 }

//                 // Actualizar el carrito en el almacenamiento persistente
//                 cart = await cartDAO.updateOneCart(cart);
//             }

//             console.log("Carrito después de agregar producto:", cart);

//             res.status(200).send("Producto agregado al carrito exitosamente");
//         } catch (error) {
//             console.error("Error al agregar el producto al carrito:", error);
//             res.status(500).send("Error al agregar el producto al carrito: " + error.message);
//         }
// }

static ProductIdAddToCart = async (req, res) => {
    const productId = req.params.pid;
    const userId = req.user._id;  // Obtener el ID del usuario logueado

    try {
        // Verificar si el producto está disponible
        const product = await productosDAO.getOneById(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        if (product.stock === 0) {
            return res.status(400).send("Producto no disponible en stock");
        }

        // Obtener el usuario con su carrito
        let user = await usuariosDAO.getUserById(userId);
        let cart;

        if (!user.cart) {
            // Crear un nuevo carrito si el usuario no tiene uno
            cart = await cartDAO.createCart({ products: [productId] });
            // Asociar el carrito al usuario
            await usuariosDAO.updateUserCart(userId, cart._id);
        } else {
            // Obtener el carrito existente
            cart = await cartDAO.getOneById(user.cart._id);
            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }

            console.log("Agregando producto al carrito. ProductId:", productId, "CartId:", cart._id);

            // Verificar si el producto ya está en el carrito
            if (!cart.products.includes(productId)) {
                cart.products.push(productId);  // Agregar el ID del producto directamente
            }

            // Actualizar el carrito en el almacenamiento persistente
            await cartDAO.updateOneCart(cart);
        }

        console.log("Carrito después de agregar producto:", cart);

        res.status(200).send("Producto agregado al carrito exitosamente");
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error al agregar el producto al carrito: " + error.message);
    }
}


}
