import { usuariosModelo } from "./models/usuario.modelo.js";



export class UsuariosMongoDAO{

    async updateUserCart2(userId, cartId) {
        try {
            const updatedUser = await usuariosModelo.findByIdAndUpdate(
                userId,
                { $set: { cart: cartId } },
                { new: true }
            ).lean();

            return updatedUser;
        } catch (error) {
            throw new Error(`Error al actualizar el usuario en la base de datos: ${error.message}`);
        }
    }

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

    async getBy(filtro) {
        return await usuariosModelo.findOne(filtro).lean();
    }

    async update(userId, updateData) {
        try {
            return await usuariosModelo.findByIdAndUpdate(userId, updateData, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

}