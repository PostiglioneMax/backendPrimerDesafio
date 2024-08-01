import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve('../data/productos.json');

class ProductosFsDAO {
  constructor() {
    this.ensureFileExists();
  }

  async ensureFileExists() {
    try {
      await fs.access(filePath);
    } catch (error) {
      await fs.writeFile(filePath, '[]');
    }
  }

  async _readFile() {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async _writeFile(data) {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllProducts(filtro = {}) {
    const products = await this._readFile();
    return products.filter(product => {
      return Object.keys(filtro).every(key => product[key] === filtro[key]);
    });
  }

  async getAllPaginate(options) {
    const { page = 1, limit = 10 } = options;
    const products = await this._readFile();
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = products.slice(start, end);
    return {
      docs: paginatedProducts,
      totalDocs: products.length,
      limit,
      page,
      totalPages: Math.ceil(products.length / limit),
      pagingCounter: start + 1,
      hasPrevPage: page > 1,
      hasNextPage: end < products.length,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: end < products.length ? page + 1 : null,
    };
  }

  async getOneBy(filtro = {}) {
    const products = await this._readFile();
    return products.find(product => {
      return Object.keys(filtro).every(key => product[key] === filtro[key]);
    });
  }

  async getOneById(productId) {
    const products = await this._readFile();
    return products.find(product => product._id === productId);
  }

  // UPDATE
  async updateOneProduct(pid, updatedFields) {
    const products = await this._readFile();
    const index = products.findIndex(product => product._id === pid);
    if (index === -1) return null;
    const updatedProduct = { ...products[index], ...updatedFields };
    products[index] = updatedProduct;
    await this._writeFile(products);
    return updatedProduct;
  }

  async addProduct(producto) {
    const products = await this._readFile();
    const newProduct = { ...producto, _id: Date.now().toString() }; // Generar un ID único simple
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async deleteProduct(productId) {
    const products = await this._readFile();
    const index = products.findIndex(product => product._id === productId);
    if (index === -1) return null;
    const deletedProduct = products.splice(index, 1);
    await this._writeFile(products);
    return deletedProduct[0];
  }
}

export default ProductosFsDAO;
