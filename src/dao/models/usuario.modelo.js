import mongoose from 'mongoose'

export const usuariosModelo=mongoose.model('usuarios',new mongoose.Schema({
    nombre: String,
    email:{
        type: String, unique:true
    }, 
    password: String,
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', // valor predeterminado
      }
},
{
timestamps:true, strict:false
}
)
)