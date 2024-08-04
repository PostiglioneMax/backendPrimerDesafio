import { CartMongoDAO as CartDAO } from "../dao/cartMongoDAO.js";
import { UsuariosMongoDAO as UsuariosDAO } from "../dao/usuariosMongoDAO.js";
import { ProductosService } from "../Services/productos.service.js";
import { faker } from "@faker-js/faker";
import { ERRORES } from "../utils/erroresDef.js";
import { CustomError } from "../utils/customError.js";
import { argumentosProducto } from "../utils/erroresProductos.js";
import { enviarMail } from "../utils.js";

const usuariosDAO = new UsuariosDAO()
const cartDAO = new CartDAO()
const productosService= new ProductosService()

export default class ProductosController {

    static getProducts = async (req, res) => {
        try {
            const products = await productosService.obtenerTodosLosProductos();
            res.status(200).json({ status: 'success', payload: {products} });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
        }
    }

    static getProductById=async(req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productosService.obtenerProductoPorId(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.status(200).render("detalle", { product });
    } catch (error) {
        res.status(500).send("Error al obtener el producto: " + error.message);
    }
}

    static addProduct=async(req, res, next) => {
            let { title, description, price, category, stock } = req.body;
            
            try {
                if (!title || !description || !price || !category || !stock) {
                    CustomError.createError({
                        name: "Error al crear producto",
                        cause: argumentosProducto(req.body),
                        message: "Complete todas las prop",
                        code: ERRORES['ARGUMENTOS INVALIDOS']
                    });
                }
                if (!req.user) {
                    console.error('Usuario no autenticado');
                    return res.status(401).json({ error: 'No existen usuarios autenticados' });
                }

                const userId = req.user._id;
                const user = await usuariosDAO.getUserById(userId)

                if (!user) {
                    return res.status(404).json({ error: 'Error al identificar el usuario' });
                }

                let owner = 'admin';
                if (user.rol === 'premium') {
                owner = user.email;
                }

                let nuevoProducto = await productosService.agregarProducto({ title, description, price, category, stock, owner });
                res.setHeader('Content-Type', 'application/json');
                return res.status(201).json({ payload: nuevoProducto });
            } catch (error) {
                console.error('Error en addProduct:', error); 
                next(error)
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

        const updatedProduct = await productosService.actualizarProducto(pid, updatedFields);

        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        res.status(200).json({ status: "success", message: "Producto actualizado correctamente", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}

static deleteProduct = async (req, res, next) => {
    const productId = req.params.pid;

    try {
        const user = req.user;
        const product = await productosService.obtenerProductoPorId(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (user.role === 'premium' && product.owner !== user.email) {
            return res.status(403).json({ error: 'No tiene permisos para eliminar este producto' });
        }

        // Eliminar el producto
        await productosService.eliminarProducto(productId);

        // Enviar correo si el dueño del producto es premium
        const owner = await usuariosDAO.getBy({ email: product.owner });
        if (owner && owner.rol === 'premium') {
            await enviarMail(owner.email, 'Producto eliminado', `El producto "${product.title}" ha sido eliminado de tu cuenta.`);
        }

        res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};

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
        const {
            docs:
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        } = await productosService.obtenerProductosPaginados(options);
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

static getMockingProducts = (req, res) => {
    const products = [];
    const { limit = 10, pagina = 1 } = req.query; 
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(pagina, 10);

    for (let i = 0; i < 100; i++) {
      const product = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        availability: faker.datatype.boolean(),
        stock: faker.datatype.number({ min: 1, max: 100 }),
        quantity: faker.datatype.number({ min: 1, max: 10 })
      };
      products.push(product);
    }

    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = parsedPage * parsedLimit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.status(200).render("productosMocking",{
      products: paginatedProducts,
      totalPages: Math.ceil(products.length / parsedLimit),
      currentPage: parsedPage,
      hasPrevPage: parsedPage > 1,
      hasNextPage: parsedPage < Math.ceil(products.length / parsedLimit),
      prevPage: parsedPage > 1 ? parsedPage - 1 : null,
      nextPage: parsedPage < Math.ceil(products.length / parsedLimit) ? parsedPage + 1 : null,
    });
  }

static ProductIdAddToCart = async (req, res) => {
    const productId = req.params.pid;
    const userId = req.user._id;

    try {
        const product = await productosService.obtenerProductoPorId(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        if (product.stock === 0) {
            return res.status(400).send("Producto no disponible en stock");
        }

        if (req.user.rol === 'premium' && product.owner === req.user.email) {
            return res.status(403).send("No puede agregar a su carrito un producto que le pertenece");
        }

        let user = await usuariosDAO.getUserById(userId);
        let cart;

        if (!user.cart) {

            cart = await cartDAO.createCart({ products: [productId] });

            await usuariosDAO.updateUserCart(userId, cart._id);
        } else {

            cart = await cartDAO.getOneById(user.cart._id);
            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }

            console.log("Agregando producto al carrito. ProductId:", productId, "CartId:", cart._id);

            const existingProduct = cart.products.find(p => p.toString() === productId);

            if (existingProduct) {
                await cartDAO.updateProductQuantity(user.cart._id, productId, 1);
            } else {
                cart.products.push(productId);
                await cartDAO.updateOneCart(cart);
            }
        }

        console.log("Carrito después de agregar producto:", cart);

        res.render("detalle", {
            product,
            user
        });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error al agregar el producto al carrito: " + error.message);
    }
}


}
