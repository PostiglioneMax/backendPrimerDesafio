import { ProductosService } from "../Services/productos.service.js";

const productosService = new ProductosService();

async function testProductosService() {
  try {
    const allProducts = await productosService.obtenerTodosLosProductos();
    // console.log('Todos los productos:', allProducts);

    const paginatedProducts = await productosService.obtenerProductosPaginados({ page: 1, limit: 2 });
    // console.log('Productos paginados:', paginatedProducts);

    const productByFilter = await productosService.obtenerProductoPorFiltro({ title: 'Laptop' });
    // console.log('Producto por filtro:', productByFilter);

    const productById = await productosService.obtenerProductoPorId('3');
    // console.log('Producto por ID:', productById);

    const newProduct = await productosService.agregarProducto({
      title: 'Tablet',
      description: 'Una nueva tablet',
      price: 300,
      category: 'Electronics',
      availability: true
    });
    // console.log('Nuevo producto agregado:', newProduct);

    const updatedProduct = await productosService.actualizarProducto('2', { price: 750 });
    // console.log('Producto actualizado:', updatedProduct);

    const deletedProduct = await productosService.eliminarProducto('1');
    // console.log('Producto eliminado:', deletedProduct);
  } catch (error) {
    console.error(error);
  }
}

testProductosService();
