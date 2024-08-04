import ProductosFsDAO from "../dao/productosFsDAO.js";

export async function testProductosFsDAO() {
  const dao = new ProductosFsDAO();

  const allProducts = await dao.getAllProducts();
  // console.log('All Products:', allProducts);

  const paginatedProducts = await dao.getAllPaginate({ page: 1, limit: 2 });
  // console.log('Paginated Products:', paginatedProducts);

  const oneProductByFilter = await dao.getOneBy({ title: 'Laptop' });
  // console.log('One Product by Filter:', oneProductByFilter);

  const oneProductById = await dao.getOneById('3');
  // console.log('One Product by ID:', oneProductById);

  const newProduct = await dao.addProduct({
    title: 'Tablet',
    description: 'A new tablet',
    price: 300,
    category: 'Electronics',
    availability: true
  });
  // console.log('New Product Added:', newProduct);

  const updatedProduct = await dao.updateOneProduct('2', { price: 750 });
  // console.log('Updated Product:', updatedProduct);

  const deletedProduct = await dao.deleteProduct('1');
  // console.log('Deleted Product:', deletedProduct);
}

testProductosFsDAO();
