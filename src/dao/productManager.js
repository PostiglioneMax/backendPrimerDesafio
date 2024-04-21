import fs from "fs";
import { modeloProduct } from "./models/product.modelo.js";


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

export class ProductManagerMongo {

    async getProducts() {
        try {
            const products = await modeloProduct.find().lean();
            return products;
        } catch (error) {
            throw new Error("Error al obtener productos desde la base de datos");
        }
    }
    

    async getAllProducts(query) {
        try {
            const { limit = 10, page = 1 } = query;
            
            const options = {
                limit: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
            };
    
            const products = await modeloProduct.find({}, null, options).lean();
    
            const totalProducts = await modeloProduct.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
    
            const prevLink = hasPrevPage ? `/api/products/all?limit=${limit}&page=${page - 1}` : null;
            const nextLink = hasNextPage ? `/api/products/all?limit=${limit}&page=${page + 1}` : null;
    
            return {
                products,
                totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            };
        } catch (error) {
            console.error("Error al obtener todos los productos:", error.message);
            throw new Error("Error al obtener productos");
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await modeloProduct.findById(pid);

            if (!product) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            res.status(200).json({ status: "success", payload: product });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    async addProduct(producto) {
        try {
            //  const { title, description, price, category } = req.body;
    
            //  const newProduct = new modeloProduct({
            //      title,
            //      description,
            //      price,
            //      category,
            //      availability: true, // Asumiendo que la disponibilidad es verdadera por defecto
            //  });

            // return await newProduct.create(newProduct);
            console.log(producto);
            const newProduct =await modeloProduct.create(producto);
            console.log("Producto agregado correctamente:", newProduct);
            io.emit("productAdded",newProduct);
            return newProduct
        //return res.status(201).json({ status: "success", message: "Producto agregado correctamente", payload: producto });

        } catch (error) {
            throw new Error(error.message);

        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const { title, description, price, category, availability } = req.body;

            const updatedFields = {};
            if (title) updatedFields.title = title;
            if (description) updatedFields.description = description;
            if (price) updatedFields.price = price;
            if (category) updatedFields.category = category;
            if (availability !== undefined) updatedFields.availability = availability;

            const updatedProduct = await modeloProduct.findByIdAndUpdate(pid, updatedFields, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            res.status(200).json({ status: "success", message: "Producto actualizado correctamente", payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const deletedProduct = await modeloProduct.findByIdAndDelete(pid);

            if (!deletedProduct) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            res.status(200).json({ status: "success", message: "Producto eliminado correctamente" });
        } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
        }
        }
        }
        
        export default ProductManagerMongo;
