import fs from "fs";
import { modeloProduct } from "./src/dao/models/product.modelo.js";
import Product from "./src/dao/models/product.modelo.js";

// modeloProduct;
class ProductManager {
    constructor(path) {
        //        this.path = path;
        //        this.loadFromFile();
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
        // socket io para cuando se agregue
        io.emit("productAdded", newProduct);

        return newProduct;
    }

    async getProducts() {
        //    this.loadFromFile();
        //    return this.products;
        return await modeloProduct.find();
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
            io.emit("productDeleted", id);

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

const productManager = {
    // Obtener todos los productos
    getAllProducts: async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, category, stock } = req.query;
            const options = {
                limit: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
            };

            let productsQuery = Product.find();

            if (category) {
                productsQuery = productsQuery.where("category").equals(category);
            }

            if (stock) {
                productsQuery = productsQuery.where("stock").gte(stock);
            }

            if (sort === "asc" || sort === "desc") {
                productsQuery = productsQuery.sort({ price: sort });
            }

            const products = await productsQuery.exec();
            const totalProducts = await Product.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}` : null;
            const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}` : null;

            res.json({
                status: "success",
                payload: products,
                totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Obtener un producto por su ID
    getProductById: async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await Product.findById(pid);

            if (!product) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            res.json({ status: "success", payload: product });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Agregar un nuevo producto
    addProduct: async (req, res) => {
        try {
            const { title, description, price, category, availability } = req.body;

            if (!title || !description || !price || !category) {
                return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
            }

            const newProduct = new Product({
                title,
                description,
                price,
                category,
                availability: availability || true,
            });

            await newProduct.save();

            res.status(201).json({ status: "success", message: "Producto agregado correctamente", payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Actualizar un producto por su ID
    updateProduct: async (req, res) => {
        try {
            const { pid } = req.params;
            const { title, description, price, category, availability } = req.body;

            const updatedFields = {};
            if (title) updatedFields.title = title;
            if (description) updatedFields.description = description;
            if (price) updatedFields.price = price;
            if (category) updatedFields.category = category;
            if (availability) updatedFields.availability = availability;

            const updatedProduct = await Product.findByIdAndUpdate(pid, updatedFields, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            res.json({ status: "success", message: "Producto actualizado correctamente", payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },

    // Eliminar un producto por su ID
    deleteProduct: async (req, res) => {
        try {
            const { pid } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(pid);

            if (!deletedProduct) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            res.json({ status: "success", message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    },
};

export default ProductManager;
