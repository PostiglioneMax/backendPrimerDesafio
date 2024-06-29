import { Router } from 'express';
import { SECRET, creaHash, validaPassword } from '../utils.js';
import { UsuariosManagerMongo } from '../dao/usuarioManager.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { CartMongoDAO as CartDAO } from '../dao/cartMongoDAO.js';
export const router=Router()

let cartDAO=new CartDAO()
let usuariosManager=new UsuariosManagerMongo()

router.get('/github', passport.authenticate("github", {}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github', { failureRedirect: '/api/sessions/errorGitHub', session: false }), (req, res) => {
    if (!req.user) {
        console.log("Error: req.user no está definido");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
            detalle: "Fallo al autenticar con GitHub"
        });
    }
    let usuario=req.user
            usuario={...usuario}
            delete usuario.password
            delete usuario.profileGithub
            // req.session.usuario=usuario // en un punto de mi proyecto
            let token=jwt.sign(usuario, SECRET, {expiresIn:"1h"})
            console.log("esto es un token:", token)
            res.cookie("coderCookie", token, {maxAge:1000*60*60, signed:true, httpOnly:true})
            console.log("Cookie C R E A D A")

            return res.status(200).json({
                usuarioLogueado: usuario,
            })

    // const { usuario, token } = req.user;
    // console.log("Datos del usuario en req.user:", req.user);
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(200).json({
    //     payload: "Login correcto",
    //     usuario: usuario,
    //     token: token
    // });
});

router.get("/errorGitHub", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`Fallo al autenticar con GitHub`
        }
    )
    
})


router.post('/registro', passport.authenticate("registro", {session: false, failureRedirect:"/api/sessions/errorRegistro"}) , async(req,res)=>{
    
    // let {nombre, email, password} =req.body
    // if(!nombre || !email || !password){
        //      res.setHeader('Content-Type','application/json');
        //      return res.status(400).json({error:`Faltan datos`})
        // }
        
        // let existe=await usuariosManager.getBy({email})
        // if(existe){
            //      res.setHeader('Content-Type','application/json');
            //      return res.status(400).json({error:`Ya existen usuarios con email ${email}`})
            // }
            
            // // validaciones extra...
            // password=creaHash(password)
            
            // try {
                //     let nuevoUsuario=await usuariosManager.create({nombre, email, password})
                
                //     //  res.setHeader('Content-Type','application/json');
                //     //  return res.status(200).json({payload:"Registro exitoso", nuevoUsuario});
                //     return res.redirect(`/login`)
                // } catch (error) {
                    //     return res.redirect(`/registro?error=Error 500 - error inesperado`)
                    
                    // }
                    console.log("soy un req.user:",req.user); // cuando es exitoso el registro passport deja un req.user
                    return res.redirect(`/registro?mensaje=Registro exitoso para ${req.user.nombre}`)


                })
                
router.get("/errorRegistro", (req, res)=>{
                
return res.redirect(`/registro?error=Error 500 - error inesperado`)
                
})
                
                
router.post('/login', passport.authenticate("login", {session: false, failureRedirect:"/api/sessions/errorLogin"}), async(req,res)=>{
                    
                    // let {email, password} =req.body
                    // if(!email || !password){
                        //     res.setHeader('Content-Type','application/json');
                        //     return res.status(400).json({error:`Faltan datos`})
                        // }
                        
                        // let usuario=await usuariosManager.getBy({email})
                        // if(!usuario){
                            //     res.setHeader('Content-Type','application/json');
                            //     return res.status(401).json({error:`Credenciales incorrectas`})
                            // }
                            
                            // // if(usuario.password!==creaHash(password)){
                                //     if(!validaPassword(usuario, password)){
                                    //     res.setHeader('Content-Type','application/json');
                                    //     return res.status(401).json({error:`Credenciales incorrectas`})
                                    // }
                                
            
            // SEGUNDO TRY                        
             let usuario=req.user
             usuario={...usuario}
             delete usuario.password
             // req.session.usuario=usuario // en un punto de mi proyecto
             let token=jwt.sign(usuario, SECRET, {expiresIn:"1h"})
             console.log("esto es un token:", token)
             res.cookie("coderCookie", token, {maxAge:1000*60*60, signed:true, httpOnly:true})
             return res.status(200).json({
                 usuarioLogueado: usuario,
             })
                                 
 })



router.get("/errorLogin", (req, res)=>{
    // return res.status(400).json({error:`Error en el proceso de login... :(`})
    return res.redirect(`/login?error=Error 500 - error inesperado`)
})

router.get('/logout',(req,res)=>{

    // req.session.destroy(e=>{
    //     if(e){
    //         res.setHeader('Content-Type','application/json');
    //         return res.status(500).json(
    //             {
    //                 error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
    //                 detalle:`${e.message}`
    //             }
    //         )
            
    //     }
    // })
    // return res.redirect(`/login`)
    res.clearCookie('coderCookie'); // Elimina la cookie que contiene el token
    return res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión
});

export default router;
