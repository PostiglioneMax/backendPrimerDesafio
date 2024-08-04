import { Router } from 'express';
import passport from 'passport';
import { auth } from '../middlewares/auth.js';
import UsuariosController from '../controller/usuario.controller.js';

export const router=Router()

let usuarioController=new UsuariosController()


router.get('/', passport.authenticate('jwt', { session: false }), auth(['admin']), usuarioController.getAllUsers);

router.delete('/', passport.authenticate('jwt', { session: false }), auth(['admin']), usuarioController.deleteInactiveUsers);


router.put('/:id/rol', passport.authenticate('jwt', { session: false }), auth(['admin']), usuarioController.updateUserRole);
router.delete('/:id', passport.authenticate('jwt', { session: false }), auth(['admin']), usuarioController.deleteUser);

router.get('/admin/users', passport.authenticate('jwt', { session: false }), auth(['admin']), usuarioController.adminPov)



export default router;
