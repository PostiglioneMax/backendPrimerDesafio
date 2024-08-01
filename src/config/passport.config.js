import passport from "passport";
import local from "passport-local";
import github from "passport-github2"
import passportjwt from "passport-jwt"
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
                        return done(null, false)
                    }
                
                    let existe=await usuariosManager.getBy({email})
                    if(existe){
                        return done(null, false)                      
                    }
                
                    password=creaHash(password)
                
                    
                    let nuevoUsuario=await usuariosManager.create({nombre, email, password})
                    console.log("soy un nuevo ususario:",nuevoUsuario);
                
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
                        return done(null, false)
                    }
                
                        if(!validaPassword(usuario, password)){
                        return done(null, false)
                    }
                
                    return done(null, usuario)
                                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

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


}
