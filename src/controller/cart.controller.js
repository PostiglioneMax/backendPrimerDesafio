import { CartMongoDAO as CartDAO } from "../dao/cartMongoDAO.js";


const cartDAO = new CartDAO()

export default class CartController{

    static getCartById = async (req, res) => {
        const { cartId } = req.params;
        try {
            const cart = await cartDAO.getOneById(cartId);
            res.render("cart", { cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static addProductToCart = async (req, res) => {
        const { cartId } = req.params;
        const { productId } = req.body;
        try {
            if (cartId === "0" || !mongoose.Types.ObjectId.isValid(cartId)) {
                const newCart = await cartDAO.createCart({ products: [] })
                const cart = await newCart.save();
                return cart;
            }

            const cart = await cartDAO.getOneById(cartId)
            
            const productObjectId = mongoose.Types.ObjectId(productId);
            
            cart.products.push(productObjectId);
            
            await cartDAO.updateOneCart(cart);
    
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    };

    static deleteProductFromCart = async (req, res) => {
        const { cartId, productId } = req.params;
        try {
            const cart = await cartDAO.getOneById(cartId);
            
            cart.products = cart.products.filter(product => product.productId.toString() !== productId);
            return await cart.save();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static updateCart = async (req, res) => {
        const { cartId } = req.params;
        const { products } = req.body;
        try {
            const cart = await cartDAO.getOneById(cartId);
            const newCart = await cartDAO.updateOneCart(cart);
            return newCart
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static updateProductQuantity = async (req, res) => {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        try {
            const cart = await cartDAO.getOneById(cartId);

            if(!cart){
                res.status(500).json({ error: error.message })
            }
            
            const product = cart.products.find(product => product.productId.toString() === productId);
            if (product) {
                product.quantity = quantity;
            }
            
            await cart.save();
            
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito");
        }
    }

    static deleteAllProducts = async (req, res) => {
        const { cartId } = req.params;
        try {
            const cart = await cartDAO.getOneById(cartId);
            
            cart.products = [];
            await cart.save();
            
            return cart;
        } catch (error) {
            throw new Error("Error al limpiar el carrito");
        }
    }

}