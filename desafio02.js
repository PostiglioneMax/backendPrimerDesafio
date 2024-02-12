const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;
        this.loadFromFile();
    }

    addProduct(productData) {
        // Validar que todos los campos sean obligatorios
        const { title, description, price, thumbnail, code, stock } = productData;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        // Validar que no se repita code
        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            console.error("Ya existe un producto con el mismo código");
            return;
        }

        // Agregar el producto al arreglo
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
        this.saveToFile();
        console.log("Producto agregado:", newProduct);
    }

    getProducts() {
        this.loadFromFile();
        return this.products;
    }

    getProductById(id) {
        this.loadFromFile();
        const product = this.products.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
        }
    }

    updateProduct(id, updatedFields) {
        this.loadFromFile();
        const index = this.products.findIndex((p) => p.id === id);

        if (index !== -1) {
            // No se actualiza el ID
            this.products[index] = { ...this.products[index], ...updatedFields, id };
            this.saveToFile();
            console.log("Producto actualizado:", this.products[index]);
        } else {
            console.error("Producto no encontrado");
        }
    }

    deleteProduct(id) {
        this.loadFromFile();
        const index = this.products.findIndex((p) => p.id === id);

        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1);
            this.saveToFile();
            console.log("Producto eliminado:", deletedProduct);
        } else {
            console.error("Producto no encontrado");
        }
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, "utf8");
            this.products = JSON.parse(data);
            this.nextId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
            console.log("Datos cargados desde el archivo:", this.products);
        } catch (error) {
            this.products = [];
            this.nextId = 1;
            console.log("Error al cargar el archivo:", error.message);
        }
    }

    saveToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data);
            console.log("Datos guardados en el archivo:", this.products);
        } catch (error) {
            console.error("Error al guardar en el archivo:", error.message);
        }
    }
}

// Testing:
const productManager = new ProductManager("productos.json");

productManager.addProduct({
    title: "Producto 1",
    description: "Descripción 1",
    price: 19.99,
    thumbnail: "imagen1.jpg",
    code: "P001",
    stock: 10,
});

productManager.addProduct({
    title: "Producto 2",
    description: "Descripción 2",
    price: 29.99,
    thumbnail: "imagen2.jpg",
    code: "P002",
    stock: 5,
});

console.log("Todos los productos:", productManager.getProducts());

const productIdToUpdate = 2;
productManager.updateProduct(productIdToUpdate, { price: 39.99 });

const productIdToDelete = 1;
productManager.deleteProduct(productIdToDelete);

console.log("Productos después de la actualización y eliminación:", productManager.getProducts());
