import ProductosFsDAO from "../dao/productosFsDAO.js";

export async function testProductosFsDAO() {
  const dao = new ProductosFsDAO();

  // Get all products
  const allProducts = await dao.getAllProducts();
  console.log('All Products:', allProducts);

  // Get paginated products
  const paginatedProducts = await dao.getAllPaginate({ page: 1, limit: 2 });
  console.log('Paginated Products:', paginatedProducts);

  // Get one product by filter
  const oneProductByFilter = await dao.getOneBy({ title: 'Laptop' });
  console.log('One Product by Filter:', oneProductByFilter);

  // Get one product by ID
  const oneProductById = await dao.getOneById('3');
  console.log('One Product by ID:', oneProductById);

  // Add a new product
  const newProduct = await dao.addProduct({
    title: 'Tablet',
    description: 'A new tablet',
    price: 300,
    category: 'Electronics',
    availability: true
  });
  console.log('New Product Added:', newProduct);

  // Update a product
  const updatedProduct = await dao.updateOneProduct('2', { price: 750 });
  console.log('Updated Product:', updatedProduct);

  // Delete a product
  const deletedProduct = await dao.deleteProduct('1');
  console.log('Deleted Product:', deletedProduct);
}

testProductosFsDAO();
