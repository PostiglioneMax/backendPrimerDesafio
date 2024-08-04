import modeloProduct from "./models/product.modelo.js"


export class ProductosMongoDAO{

    async getAllProducts(filtro={}){
        return await modeloProduct.find(filtro).lean() 
    }

    async getAllPaginate(options){
        return await modeloProduct.paginate({}, { ...options, lean: true });
    }

    async getOneBy(filtro={}){  
        return await modeloProduct.findOne(filtro)
    }

    async getOneById(productId){
        return await modeloProduct.findById(productId).lean()
        console.log(productId)
    }

    async updateOneProduct(pid, updatedFields){   
        return await modeloProduct.findByIdAndUpdate(pid, updatedFields, { new: true })
    }


    async addProduct(producto){
        return await modeloProduct.create(producto)
    } 

    async deleteProduct(productId){
        return await modeloProduct.findByIdAndDelete(productId)
    }

}