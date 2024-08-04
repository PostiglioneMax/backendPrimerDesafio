import passport from "passport";


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
export const authenticateMiddleware = (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            req.login(user, { session: false }, async (error) => {
                if (error) {
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                
                next();
            });

        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    })(req, res, next);
};