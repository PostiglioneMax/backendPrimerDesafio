import mongoose from 'mongoose'

export const usuariosModelo=mongoose.model('usuarios',new mongoose.Schema({
    nombre: String,
    email:{
        type: String, unique:true
    }, 
    password: String,
    rol: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user', // valor predeterminado
      },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' } 
},
{
timestamps:true, strict:false
}
)
)