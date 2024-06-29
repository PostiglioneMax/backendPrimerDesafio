import { config } from '../config/config.js';

export let DAO;

switch (config.PERSISTENCE) {
  case "MONGO":
    // await import('./connDB.js'); // Conexión a la base de datos MongoDB
    DAO = (await import('../dao/productosMongoDAO.js')).ProductosMongoDAO;
    break;

  case "FS":
    DAO = (await import('../dao/productosFsDAO.js')).ProductosFsDAO;
    break;

  default:
    console.error('Persistencia mal configurada...!!!');
    process.exit();
}

