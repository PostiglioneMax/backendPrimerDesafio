import TicketService from "../Services/ticket.service.js";
import { CartMongoDAO as CartDAO } from "../dao/cartMongoDAO.js";
import { UsuariosMongoDAO } from "../dao/usuariosMongoDAO.js";

const usuariosDAO = new UsuariosMongoDAO();
const ticketService = new TicketService();
const cartDAO = new CartDAO()

export default class CartController {

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

            if (!cart) {
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
            let cart = await cartDAO.getOneById(cartId);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            const updatedCart = await cartDAO.updateOneCart2(cartId, { products: [] });

            const usuario = await usuariosDAO.updateUserCart(cart.userId, updatedCart._id);

            req.user = usuario

            res.status(200).json({ message: "Carrito limpiado correctamente", cart: updatedCart });
        } catch (error) {
            console.error("Error al limpiar el carrito:", error.message);
            res.status(500).json({ error: "Error al limpiar el carrito" });
        }
    }



    static cartPurchase = async (req, res) => {

        const cartId = req.user.cart;

        try {
            const cart = await cartDAO.getOneById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const purchaser = req.user.email;
            const { products } = cart;

            const { ticket, failedPurchaseIds, remainingProducts } = await ticketService.processPurchase(products, purchaser);

            await cartDAO.updateOneCart2(cartId, { products: remainingProducts });
            console.log("CARRITO POST COMPRA PAPAA;", cartId);

            res.json({
                message: 'Compra procesada',
                ticket,
                failedPurchaseIds,
                remainingProducts
            });
        } catch (error) {
            res.status(500).json({ message: `Error al procesar la compra: ${error.message}` });
        }
    };

}