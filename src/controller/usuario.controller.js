import { UsuariosMongoDAO as UsuariosDAO } from "../dao/usuariosMongoDAO.js";

const usuariosDAO = new UsuariosDAO()

export default class UsuariosController {
    static changeUserRole = async (req, res, next) => {
        const userId = req.params.uid;

        try {
            const user = await usuariosDAO.getUserById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            let newRole;
            if (user.rol === 'user') {
                newRole = 'premium';
            } else if (user.rol === 'premium') {
                newRole = 'user';
            } else {
                return res.status(400).json({ error: 'Rol inválido' });
            }

            const updatedUser = await usuariosDAO.update(userId, { rol: newRole });

            res.status(200).json({ message: `Rol actualizado a ${updatedUser.rol}` });
        } catch (error) {
            next(error);
        }
    }
}
