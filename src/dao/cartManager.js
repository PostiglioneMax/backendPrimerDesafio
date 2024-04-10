import modeloCart from "./models/cart.modelo.js";

class CartManager {
    constructor() {}
    // Obtener todos los carritos
    async getAllCarts(req, res) {
        try {
            const carts = await modeloCart.find().populate("products");

            res.json({ status: "success", payload: carts });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    // Obtener un carrito por su ID
    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await modeloCart.findById(cid).populate("products");

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            res.json({ status: "success", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    // Agregar un nuevo carrito
    async addCart(req, res) {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();

            res.status(201).json({ status: "success", message: "Carrito creado correctamente", payload: newCart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    // Actualizar un carrito por su ID
    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;

            const updatedCart = await modeloCart.findByIdAndUpdate(cid, { products }, { new: true }).populate("products");

            if (!updatedCart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            res.json({ status: "success", message: "Carrito actualizado correctamente", payload: updatedCart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const cart = await modeloCart.findById(cid);

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = modeloCart.products.findIndex((item) => item.product.equals(pid));

            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                cart.products[existingProductIndex].quantity += quantity || 1;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ product: pid, quantity: quantity || 1 });
            }

            await cart.save();

            res.json({ status: "success", message: "Producto agregado al carrito correctamente", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    // Eliminar un producto de un carrito
    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;

            const cart = await modeloCart.findById(cid);

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            // Filtrar los productos para eliminar el que coincida con el ID dado
            cart.products = cart.products.filter((item) => !item.product.equals(pid));

            await cart.save();

            res.json({ status: "success", message: "Producto eliminado del carrito correctamente", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    // Eliminar todos los productos de un carrito
    async removeAllProductsFromCart(req, res) {
        try {
            const { cid } = req.params;

            const cart = await modeloCart.findById(cid);

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            cart.products = [];
            await cart.save();

            res.json({ status: "success", message: "Todos los productos eliminados del carrito correctamente", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }
}

export default CartManager;
