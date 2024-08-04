import { config } from "../config/config.js";
import { UsuariosMongoDAO as UsuariosDAO } from "../dao/usuariosMongoDAO.js";
import { creaHash, enviarMail } from "../utils.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"



const usuariosDAO = new UsuariosDAO()


export default class RecuperoController{
    static recupero01 = async(req, res)=>{
        let {email}=req.body
        if(!email){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Complete email`})
        }
    
        let usuario=await usuariosDAO.getBy({email})
        if(!usuario){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe usuario...!!!`})
        }
        
    
        delete usuario.password
        delete usuario.profileGithub
        let token=jwt.sign(usuario, config.SECRET, {expiresIn:"1h"})
        let url=`http://localhost:3000/api/sessions/recupero02?token=${token}`
        let mensaje=`Ha solicitado reinicio de password. Si no fue usted, avise al 
    admin... para continuar haga click <a href="${url}">aqui</a>`
    
        try {
            await enviarMail(email, "Recupero de password", mensaje)
            res.redirect("/recupero01.html?mensaje=Recibira un email en breve. Siga los pasos...")
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
        }
    
    }

    static recupero02 = (req, res) => {
        const { token } = req.query;

        try {
            jwt.verify(token, config.SECRET);
            res.status(200).redirect(`/recupero02.html?token=${token}`);
        } catch (error) {
            res.status(400).redirect(`/recupero01.html?mensaje=token invalido o expirado`);
        }
    }

    static recupero03 = async (req, res) => {
        const { token, password, password2 } = req.body;

        if (!token || !password || !password2) {
            return res.status(400).send('Faltan datos en la solicitud');
        }

        if (password !== password2) {
            return res.status(400).send('Las contraseñas no coinciden');
        }

        try {
            const decoded = jwt.verify(token, config.SECRET);
            const user = await usuariosDAO.getBy({ email: decoded.email });

            if (!user) {
                return res.status(400).send('Usuario no encontrado');
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const updatedUser = await usuariosDAO.update(user._id, { password: hashedPassword });

            res.status(200).redirect(`/login?mensaje=Contraseña actualizada con exito`);
        } catch (error) {
            console.error('Error al verificar el token en recupero03:', error);
            res.status(400).send('Token inválido o expirado');
        }
    }
}