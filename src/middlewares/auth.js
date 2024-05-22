import jwt from "jsonwebtoken"
import { SECRET } from "../utils.js"

// export const auth=(req, res, next)=>{
//     // if(!req.session.usuario){
//     //     // res.setHeader('Content-Type','application/json');
//     //     // return res.status(401).json({error:`No hay usuarios autenticados`})
//     //     return res.redirect("/login?error=debes registrarte")
//     // }
//     let token = null
//     if(req.headers.authorization){
//     console.log(req.headers.authorization)
//     token=req.headers.authorization.split(" ")[1]
// }
//     if(!token){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`No hay usuarios autenticados`})
//     }

//     try{
//         let usuario=jwt.verify(token, SECRET)
//         req.user=usuario
//     } catch(error){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json(
//             {
//                 error:`Error inesperado del servidor`,
//                 detalle: `${error.message}`

//             })

//     }

//     next()
// }

export const auth=(accesos=[])=>{
    return (req, res, next)=>{
        accesos=accesos.map(a=>a.toLowerCase())

        if(accesos.includes("public")){
            return next()
        }

        if(!req.user || !req.user.rol){
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`No existen usuarios autenticados`})
        }

        if(!accesos.includes(req.user.rol.toLowerCase())){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No tiene privilegios suficientes para acceder al recurso`})
        }

        next()
    }
}