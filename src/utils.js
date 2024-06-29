import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import passport from "passport";
import modeloCart from "./dao/models/cart.modelo.js";
import { CartMongoDAO as CartDAO } from "./dao/cartMongoDAO.js";
import { title } from "process";


const cartDAO = new CartDAO()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const SECRET = "CoderCoder123"
// export const creaHash=password=>crypto.createHmac("sha256",SECRET).update(password).digest("hex")
export const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword = (usuario, password) => bcrypt.compareSync(password, usuario.password)

export const passportCall = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
      if (err) { return next(err) }
      if (!user) {
        // res.setHeader('Content-Type','application/json');
        return res.status(401).json({ error: 'Credenciales incorrectas', detalle: info.message });
        // return res.status(401).json({
        //     error:info.message?info.message:info.toString(),
        //     detalle:info.detalle?info.detalle:"-",

        // })
      }
      // res.redirect('/account');
      req.user = user
      next()
    })(req, res, next);
  }
}


export const checkAuth = async (req, res, next) => {
  // Verificar si existe la cookie con el token
  const token = req.signedCookies.coderCookie;

  if (token) {
    // Si hay un token presente, intenta verificarlo
    jwt.verify(token, SECRET, async(err, decoded) => {
      if (err) {
        // Si hay un error al verificar el token, el usuario no está autenticado
        req.isAuthenticated = false;
      } else {
        // Si se verifica correctamente, el usuario está autenticado y se almacena su información en la solicitud
        req.isAuthenticated = true;
        req.user = decoded; // Guardar la información del usuario en la solicitud
        console.log("....req.user!!!",decoded);
        if (req.user.cart) {
          const cart = await cartDAO.getOneById(req.user.cart);
          req.user.cart = cart;
        }
      }
      next(); // Llama al siguiente middleware
    });
  } else {
    // Si no hay token presente, el usuario no está autenticado
    req.isAuthenticated = false;
    next(); // Llama al siguiente middleware
  }
};
//2nd CHECKAUTH

export const checkAuth2 = async (req, res, next) => {
  const token = req.signedCookies.coderCookie;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.isAuthenticated = true;
      req.user = decoded;

      // Recuperar y poblar el carrito
      if (req.user.cart) {
        const cart = await cartDAO.getOneById(req.user.cart).populate('products').lean();
        req.user.cart = cart;
      }
      next();
    } catch (err) {
      req.isAuthenticated = false;
      next();
    }
  } else {
    req.isAuthenticated = false;
    next();
  }
};

