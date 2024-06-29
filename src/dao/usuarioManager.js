import { usuariosModelo } from "./models/usuario.modelo.js";

export class UsuariosManagerMongo{

    async create(usuario){
        let nuevoUsuario=await usuariosModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    // async getBy(filtro){   // {email}
    //     return await usuariosModelo.findOne(filtro).lean()
    // }
    async getBy(filtro) {
        return await usuariosModelo.findOne(filtro).lean();
    }
    

}