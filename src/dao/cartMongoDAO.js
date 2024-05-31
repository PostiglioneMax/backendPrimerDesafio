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

}