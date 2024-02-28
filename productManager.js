import fs from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
        this.loadFromFile();
    }

    addProduct(productData) {
        // Validar que todos los campos obligatorios estén presentes
        const { title, description, code, price, stock } = productData;
        if (!title || !description || !code || !price || !stock) {
            throw new Error("Todos los campos son obligatorios, excepto thumbnails.");
        }

        // Validar que no se repita el campo "code"
        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            throw new Error("Ya existe un producto con el mismo código");
        }

        // Agregar el producto al arreglo
        const newProduct = {
            id: this.nextId++,
            title,
            description,
            code,
            price,
            stock,
            status: true, // Por defecto
            category: productData.category || "", // Puede ser undefined
            thumbnails: productData.thumbnails || [],
        };

        this.products.push(newProduct);
        this.saveToFile();
        console.log("Producto agregado:", newProduct);
        return newProduct;
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
            throw new Error("Producto no encontrado");
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
            return this.products[index];
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    deleteProduct(id) {
        this.loadFromFile();
        const index = this.products.findIndex((p) => p.id === id);

        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1);
            this.saveToFile();
            console.log("Producto eliminado:", deletedProduct);
            return deletedProduct;
        } else {
            throw new Error("Producto no encontrado");
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

export default ProductManager;
