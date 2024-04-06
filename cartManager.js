import Cart from "../models/Cart.js";

const cartManager = {
    // Obtener todos los carritos
    getAllCarts: async (req, res) => {
        try {
            const carts = await Cart.find().populate("products");

            res.json({ status: "success", payload: carts });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Obtener un carrito por su ID
    getCartById: async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await Cart.findById(cid).populate("products");

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            res.json({ status: "success", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Agregar un nuevo carrito
    addCart: async (req, res) => {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();

            res.status(201).json({ status: "success", message: "Carrito creado correctamente", payload: newCart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Actualizar un carrito por su ID
    updateCart: async (req, res) => {
        try {
            const { cid } = req.params;
            const { products } = req.body;

            const updatedCart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate("products");

            if (!updatedCart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            res.json({ status: "success", message: "Carrito actualizado correctamente", payload: updatedCart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Agregar un producto a un carrito
    addProductToCart: async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const cart = await Cart.findById(cid);

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex((item) => item.product.equals(pid));

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
    },

    // Eliminar un producto de un carrito
    removeProductFromCart: async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const cart = await Cart.findById(cid);

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
    },

    // Eliminar todos los productos de un carrito
    removeAllProductsFromCart: async (req, res) => {
        try {
            const { cid } = req.params;

            const cart = await Cart.findById(cid);

            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            cart.products = [];
            await cart.save();

            res.json({ status: "success", message: "Todos los productos eliminados del carrito correctamente", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },
};

export default cartManager;