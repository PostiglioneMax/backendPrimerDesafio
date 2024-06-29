import modeloCart from "./models/cart.modelo.js"
import { usuariosModelo } from "./models/usuario.modelo.js";


export class CartMongoDAO{


    async getOneBy(filtro={}){   // filtro = {email:"juan@test.com", apellido:"Perez"}
        return await modeloCart.findOne(filtro)
    }

    async getOneById(cartId){
        return await modeloCart.findById(cartId).lean().populate({
            path: 'products',
            model: 'Product'
        });
    }

    async createCart(cart){
        return await modeloCart.create(cart)
    } 

    async updateOneCart(cart){   // filtro = {email:"juan@test.com", apellido:"Perez"}
        return await modeloCart.findByIdAndUpdate(
            cart._id,
            { $set: { products: cart.products } },
            { new: true }
        ).populate({
            path: 'products',
            model: 'Product'
        });
    }

    async updateOneCart2(cartId, updatedFields) {
        try {
            const updatedCart = await modeloCart.findByIdAndUpdate(
                cartId,
                { $set: updatedFields },
                { new: true }
            ).populate({
                path: 'products',
                model: 'Product'
            });

            return updatedCart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito en la base de datos: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantityChange) {
        return await modeloCart.findOneAndUpdate(
            { _id: cartId, 'products': productId },
            { $inc: { 'products.$.quantity': quantityChange } },
            { new: true }
        ).populate({
            path: 'products',
            model: 'Product'
        });
    }


}