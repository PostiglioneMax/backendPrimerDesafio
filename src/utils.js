import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import passport from "passport";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const SECRET="CoderCoder123"
// export const creaHash=password=>crypto.createHmac("sha256",SECRET).update(password).digest("hex")
export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)

export const passportCall = (estrategia) => {
    return function (req, res, next) {
        passport.authenticate(estrategia, function (err, user, info, status) {
            if (err) { return next(err) }
            if (!user) {
                res.setHeader('Content-Type','application/json');
                return res.status(401).json({
                    error:info.message?info.message:info.toString(),
                    detalle:info.detalle?info.detalle:"-",

                })
            }
            // res.redirect('/account');
            req.user=user
            next()
        })(req, res, next);
    }
}

export const checkAuth = (req, res, next) => {
    // Verificar si existe la cookie con el token
    const token = req.signedCookies.coderCookie;
  
    if (token) {
      // Si hay un token presente, intenta verificarlo
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
          // Si hay un error al verificar el token, el usuario no está autenticado
          req.isAuthenticated = false;
        } else {
          // Si se verifica correctamente, el usuario está autenticado y se almacena su información en la solicitud
          req.isAuthenticated = true;
          req.user = decoded; // Guardar la información del usuario en la solicitud
        }
        next(); // Llama al siguiente middleware
      });
    } else {
      // Si no hay token presente, el usuario no está autenticado
      req.isAuthenticated = false;
      next(); // Llama al siguiente middleware
    }
  };


//  {
//      "title": "maxi probando",
//      "description":"almacenamientou",
//      "code":"123asd",
//      "price": 1890,
//      "status": true,
//      "category": "Remeras Oversize"
//  }

// {
//     "title": "Producto de ejemplo",
//     "description": "Descripción del producto",
//     "price": 100,
//     "category": "Electrónicos"
// }

// http://localhost:3000/products/66232384a1def87e67c67c19/add-to-cart