import { Router } from 'express';
import { SECRET, creaHash, validaPassword } from '../utils.js';
import { UsuariosManagerMongo } from '../dao/usuarioManager.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { CartMongoDAO as CartDAO } from '../dao/cartMongoDAO.js';
import RecuperoController from '../controller/recupero.controller.js';
import UsuariosController from '../controller/usuario.controller.js';
import { auth } from '../middlewares/auth.js';
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

            let token=jwt.sign(usuario, SECRET, {expiresIn:"1h"})
            console.log("esto es un token:", token)
            res.cookie("coderCookie", token, {maxAge:1000*60*60, signed:true, httpOnly:true})
            console.log("Cookie C R E A D A")

            return res.status(200).json({
                usuarioLogueado: usuario,
            })
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
    console.log("soy un req.user:",req.user); // cuando es exitoso el registro passport deja un req.user
    return res.redirect(`/registro?mensaje=Registro exitoso para ${req.user.nombre}`)
})
                
router.get("/errorRegistro", (req, res)=>{
                
return res.redirect(`/registro?error=Error 500 - error inesperado`)
                
})
                
                
router.post('/login', passport.authenticate("login", {session: false, failureRedirect:"/api/sessions/errorLogin"}), async(req,res)=>{
                    
                      
    let usuario=req.user
    usuario={...usuario}
    delete usuario.profileGithub
    delete usuario.password

    let token=jwt.sign(usuario, SECRET, {expiresIn:"1h"})
    res.cookie("coderCookie", token, {maxAge:1000*60*60, signed:true, httpOnly:true})

    return res.status(200).json({
        usuarioLogueado: usuario,
    })
                                 
 })



router.get("/errorLogin", (req, res)=>{

    return res.redirect(`/login?error=Error 500 - error inesperado`)
})

router.get('/logout',(req,res)=>{

    res.clearCookie('coderCookie');
    return res.redirect('/login'); 
});

router.post('/recupero01', RecuperoController.recupero01)

router.get('/recupero02', RecuperoController.recupero02)

router.post('/recupero03', RecuperoController.recupero03);

router.put('/premium/:uid', passport.authenticate('jwt', { session: false }), auth(['admin']), UsuariosController.changeUserRole);



export default router;
