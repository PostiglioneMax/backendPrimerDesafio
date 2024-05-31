import { usuariosModelo } from "./models/usuario.modelo.js";



export class UsuariosMongoDAO{

    async updateUserCart(userId, cartId) {
        return await usuariosModelo.findByIdAndUpdate(
            userId,
            { $set: { cart: cartId } },
            { new: true }
        ).lean();
    }

    async getUserById(userId) {
        return await usuariosModelo.findById(userId).lean().populate('cart');
    }

}