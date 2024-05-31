import mongoose from "mongoose";
import modeloCart from "./models/cart.modelo.js";

export class CartManager {

    async createCart() {
        try {
            const newCart = new modeloCart({ products: [] });
            const savedCart = await newCart.save();
            return savedCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("Error al crear el carrito");
        }
    }

    // async getOrCreateCart(cartId) {
    //     try {
    //         if (!mongoose.Types.ObjectId.isValid(cartId)) {
    //             throw new Error("ID de carrito inválido");
    //         }
            
    //         const cart = await modeloCart.findById(cartId);
            
    //         if (!cart) {
    //             const newCart = new modeloCart({ products: [] });
    //             const savedCart = await newCart.save();
    //             return savedCart;
    //         }
            
    //         return cart;
    //     } catch (error) {
    //         throw new Error("Error al obtener o crear el carrito");
    //     }
    // }
    async getOrCreateCart(cartId) {
        try {
            if (cartId === "0" || !mongoose.Types.ObjectId.isValid(cartId)) {
                const newCart = new modeloCart({ products: [] })
                const savedCart = await newCart.save();
                return savedCart;
            }
            
            const cart = await modeloCart.findById(cartId).lean().populate({
                path: 'products',
                model: 'Product'
            });
            console.log("esto es un CART...",cart);
            
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            
            return cart;
        } catch (error) {
            throw new Error("Error al obtener o crear el carrito: " + error.message);
        }
    }
    // async updateCart(cart) {
    //     try {
    //         await cart.save();
    //     } catch (error) {
    //         throw new Error("Error al actualizar el carrito: " + error.message);
    //     }
    // }

    async updateCart(cart) {
        try {
            const updatedCart = await modeloCart.findByIdAndUpdate(
                cart._id,
                { $set: { products: cart.products } },
                { new: true }
            ).populate({
                path: 'products',
                model: 'Product'
            });
    
            return updatedCart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    }
    async addProductToCart(productId, cartId) {
        try {
            const cart = await this.getOrCreateCart(cartId);
            
            const productObjectId = mongoose.Types.ObjectId(productId);
            
            cart.products.push(productObjectId);
            
            await this.updateCart(cart);
    
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getOrCreateCart(cartId);
            
            cart.products = cart.products.filter(product => product.productId.toString() !== productId);
            await cart.save();
            
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito");
        }
    }


    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getOrCreateCart(cartId);
            
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

    async clearCart(cartId) {
        try {
            const cart = await this.getOrCreateCart(cartId);
            
            cart.products = [];
            await cart.save();
            
            return cart;
        } catch (error) {
            throw new Error("Error al limpiar el carrito");
        }
    }
}
export default CartManager