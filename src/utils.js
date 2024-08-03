import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import passport from "passport";
import modeloCart from "./dao/models/cart.modelo.js";
import { CartMongoDAO as CartDAO } from "./dao/cartMongoDAO.js";
import { title } from "process";
import winston from "winston";
import { config } from "./config/config.js";
import nodemailer from "nodemailer"



const cartDAO = new CartDAO()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const SECRET = "CoderCoder123"

export const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword = (usuario, password) => bcrypt.compareSync(password, usuario.password)

export const passportCall = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
      if (err) { return next(err) }
      if (!user) {

        return res.status(401).json({ error: 'Credenciales incorrectas', detalle: info.message });

      }

      req.user = user
      next()

    })(req, res, next);
  }
}


export const checkAuth = async (req, res, next) => {

  const token = req.signedCookies.coderCookie;

  if (token) {

    jwt.verify(token, SECRET, async(err, decoded) => {
      if (err) {

        req.isAuthenticated = false;
      } else {

        req.isAuthenticated = true;
        req.user = decoded;
        console.log("....req.user!!!",decoded);
        if (req.user.cart) {
          const cart = await cartDAO.getOneById(req.user.cart);
          req.user.cart = cart;
        }
      }
      next();
    });
  } else {

    req.isAuthenticated = false;
    next(); 
  }
};

export const checkAuth2 = async (req, res, next) => {
  const token = req.signedCookies.coderCookie;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.isAuthenticated = true;
      req.user = decoded;

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
// LOGGER

const customLevels={
  fatal:0,
  error:1, 
  warning:2, 
  info:3,
  http:4,
  debug:5
}

export const logger=winston.createLogger(
  {
      levels: customLevels,
      transports:[]
  }
)


const transporteFileError=new winston.transports.File({
  level: "error",
  filename: "./logs/erroresGraves.log",
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  )
})

const transporteConsolaDebug=new winston.transports.Console(
  {
      level: "debug", 
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize({
              colors:{fatal:"red", error:"red", warning:"yellow", info:"blue", http: "green", debug: "green"}
          }),
          winston.format.simple()
      )
  }
)

const transporteConsolaInfo=new winston.transports.Console(
  {
      level: "info", 
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize({
              colors:{grave:"red", medio:"yellow", info:"blue", leve: "green"}
          }),
          winston.format.simple()
      )
  }
)

if(config.MODE === "DEV"){
  logger.add(transporteConsolaDebug)
  console.log('DEV mode: Added Console Debug Transport');
}
if(config.MODE === "PRODU"){
  logger.add(transporteConsolaInfo)
  logger.add(transporteFileError)
  console.log('PROD mode: Added Console Info and File Error Transports');
}
if (logger.transports.length === 0) {
  console.warn('No transports have been added to the logger!');
}

export const middLogg=(req, res, next)=>{
  req.logger=logger
  next()
}

const trasnporter=nodemailer.createTransport(
    {
        service:"gmail", 
        port:"587",
        auth:{
            user:"postisama22@gmail.com",
            pass: "dpunkrllitpahene"
        }
    }
)

export const enviarMail=async(to, subject, message)=>{
    return await trasnporter.sendMail(
        {
            from:"MaxX Steal postisama22@gmail.com",
            to, subject, 
            html: message
        }
    )
}

