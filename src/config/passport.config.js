import passport from "passport";
import local from "passport-local";
import github from "passport-github2"
import passportjwt from "passport-jwt"
// import jwt from "jsonwebtoken" 
import { SECRET, creaHash, validaPassword } from "../utils.js";
import { UsuariosManagerMongo } from "../dao/usuarioManager.js";

const usuariosManager = new UsuariosManagerMongo()

const buscaToken=(req)=>{
    let token=null

    if(req.signedCookies.coderCookie){
        console.log("busca token...!!!")
        token=req.signedCookies.coderCookie
    }

    return token
}

// 1) Definir la fn de configuracion

export const initPassport=()=>{

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async function(req, username, password, done){
                try{
                    let {nombre, email} =req.body
                    if(!nombre || !email){
                        //  res.setHeader('Content-Type','application/json');
                        //  return res.status(400).json({error:`Faltan datos`})
                        return done(null, false)
                    }
                
                    let existe=await usuariosManager.getBy({email})
                    if(existe){
                        //  res.setHeader('Content-Type','application/json');
                        //  return res.status(400).json({error:`Ya existen usuarios con email ${email}`})
                        return done(null, false)                      
                    }
                
                    // validaciones extra...
                    password=creaHash(password)
                
                    
                    let nuevoUsuario=await usuariosManager.create({nombre, email, password})
                    console.log("soy un nuevo ususario:",nuevoUsuario);
                
                    //  res.setHeader('Content-Type','application/json');
                    //  return res.status(200).json({payload:"Registro exitoso", nuevoUsuario});
                    // return res.redirect(`/login`)
                    return done(null, nuevoUsuario)
                } catch(error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done)=>{
                try {
                    let usuario=await usuariosManager.getBy({email:username})
                    if(!usuario){
                        // res.setHeader('Content-Type','application/json');
                        // return res.status(401).json({error:`Credenciales incorrectas`})
                        return done(null, false)
                    }
                
                    // if(usuario.password!==creaHash(password)){
                        if(!validaPassword(usuario, password)){
                        // res.setHeader('Content-Type','application/json');
                        // return res.status(401).json({error:`Credenciales incorrectas`})
                        return done(null, false)
                    }
                
                    return done(null, usuario)
                                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    // passport.use(
    //     "github",
    //     new github.Strategy(
    //         {
    //             clientID:"Iv23liGHC7q3e8sVpA0S",
    //             clientSecret:"89e5a4a4af671419ed7b96c6d00ee53fa51ee078",
    //             callbackURL:"http://localhost:3000/api/sessions/callbackGithub",
    //         },
    //         async function(accessToken, refreshToken, profile, done){
    //             try{
    //                 console.log(profile);
    //                 let nombre= profile._json.name
    //                 let email= profile._json.email
    //                 profileGithub:profile

    //                 if(!email){
    //                     return done(null, false)
    //                 }

    //                 let usuario=await usuariosManager.getBy({email})
    //                 if(!usuario){
    //                     usuario=await usuariosManager.create({
    //                         nombre, email, 
    //                         profileGithub:profile
    //                     })
    //                 }
    //             console.log("Usuario creado o recuperado:", usuario);

    //             const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '1h' });

    //             return done(null, { usuario, token })

    //             } catch(error){
    //                 return done(error)
    //             }
    //         }
    //     )
    // )

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: "Iv23liGHC7q3e8sVpA0S",
                clientSecret: "89e5a4a4af671419ed7b96c6d00ee53fa51ee078",
                callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
            },
            async function(accessToken, refreshToken, profile, done) {
                try {
                    let nombre = profile._json.name;
                    let email = profile._json.email;
    
                    if (!email) {
                        console.log("Email no encontrado en el perfil de GitHub");
                        return done(null, false);
                    }
    
                    let usuario = await usuariosManager.getBy({ email });
                    if (!usuario) {
                        usuario = await usuariosManager.create({
                            nombre,
                            email,
                        });
                    }
    
                    console.log("Usuario creado o recuperado:", usuario);
    
                    // Genera un JWT con los datos del usuario
                    // const token = jwt.sign({ nombre: usuario.nombre, email: usuario.email }, SECRET, { expiresIn: '1h' });

                    // Devuelve el usuario y el token
                    return done(null, usuario);
    
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "jwt",
        new passportjwt.Strategy(
            {
                secretOrKey: SECRET,
                jwtFromRequest: new passportjwt.ExtractJwt.fromExtractors([buscaToken])
            },
            async (contenidoToken, done)=>{
                try {
                    console.log("passport")
                    return done(null, contenidoToken)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )


    // // 1') SOLO SI se usan sessions: Def serilizer y deserializer
    // passport.serializeUser((usuario, done)=>{
    //     return done(null, usuario._id)
    // })
    // passport.deserializeUser( async (id, done)=>{
    //     let usuario=await usuariosManager.getBy({_id:id})
    //     return done(null, usuario)
    // })
}
