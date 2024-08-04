import { usuariosModelo } from "../dao/models/usuario.modelo.js";
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

    async getAllUsers(req, res) {
        try {
            const users = await usuariosDAO.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteInactiveUsers(req, res) {
        try {
            const inactiveUsers = await usuariosDAO.getInactiveUsers();
            await Promise.all(inactiveUsers.map(async user => {
                await usuariosDAO.deleteUser(user._id);
                await enviarMail(user.email, 'Cuenta eliminada por inactividad', 'Tu cuenta ha sido eliminada por inactividad.');
            }));
            res.status(200).json({ message: 'Usuarios inactivos eliminados y notificados.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUserRole(req, res) {
        const { id } = req.params;
        const { rol } = req.body;
        try {
            const updatedUser = await usuariosDAO.updateUserRole(id, rol);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await usuariosDAO.deleteUser(id);
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async adminPov(req, res) {
        try {
            const users = await usuariosDAO.getAllUsers();
            res.render('adminUsers', { users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
