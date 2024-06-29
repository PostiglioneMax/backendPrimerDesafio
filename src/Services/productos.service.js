import { DAO } from "../config/factory.js";

export class ProductosService {
  constructor() {
    this.dao = new DAO();
  }

  async obtenerTodosLosProductos(filtro = {}) {
    try {
      return await this.dao.getAllProducts(filtro);
    } catch (error) {
      throw new Error(`Error al obtener todos los productos: ${error.message}`);
    }
  }

  async obtenerProductosPaginados(options) {
    try {
      return await this.dao.getAllPaginate(options);
    } catch (error) {
      throw new Error(`Error al obtener productos paginados: ${error.message}`);
    }
  }

  async obtenerProductoPorFiltro(filtro = {}) {
    try {
      return await this.dao.getOneBy(filtro);
    } catch (error) {
      throw new Error(`Error al obtener producto por filtro: ${error.message}`);
    }
  }

  async obtenerProductoPorId(productId) {
    try {
      return await this.dao.getOneById(productId);
    } catch (error) {
      throw new Error(`Error al obtener producto por ID: ${error.message}`);
    }
  }

  async actualizarProducto(productId, updatedFields) {
    try {
      return await this.dao.updateOneProduct(productId, updatedFields);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async agregarProducto(producto) {
    try {
      return await this.dao.addProduct(producto);
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async eliminarProducto(productId) {
    try {
      return await this.dao.deleteProduct(productId);
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export const productosService=new ProductosService(DAO)