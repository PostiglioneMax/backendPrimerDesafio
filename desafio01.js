class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            console.error("Ya existe un producto con el mismo código");
            return;
        }

        const newProduct = {
            id: this.nextId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        console.log("Producto agregado:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
        }
    }
}

//test123
const productManager = new ProductManager();

productManager.addProduct("Producto 1", "Descripción 1", 19.99, "imagen1.jpg", "P001", 10);

console.log("Todos los productos:", productManager.getProducts());

const productIdToFind = 2;
const foundProduct = productManager.getProductById(productIdToFind);
console.log("Producto encontrado:", foundProduct);
