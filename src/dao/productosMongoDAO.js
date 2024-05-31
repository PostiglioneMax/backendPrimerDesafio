import modeloProduct from "./models/product.modelo.js"


export class ProductosMongoDAO{

//READ
    async getAllProducts(filtro={}){
        return await modeloProduct.find(filtro).lean() 
    }

    async getAllPaginate(options){
        return await modeloProduct.paginate({}, { ...options, lean: true });
    }

    async getOneBy(filtro={}){   // filtro = {email:"juan@test.com", apellido:"Perez"}
        return await modeloProduct.findOne(filtro)
    }

    async getOneById(productId){
        return await modeloProduct.findById(productId).lean()
        console.log(productId)
    }

//UPDATE
    async updateOneProduct(pid, updatedFields){   // filtro = {email:"juan@test.com", apellido:"Perez"}
        return await modeloProduct.findByIdAndUpdate(pid, updatedFields, { new: true })
        // GUARDA CON EL ´POPULATE QUE HABIA ANTES!!!!!!!!!!!!!!!!...........
    }


//CREATE
    async addProduct(producto){
        return await modeloProduct.create(producto)
    } 

//DELETE
    async deleteProduct(productId){   // filtro = {email:"juan@test.com", apellido:"Perez"}
        return await modeloProduct.findByIdAndDelete(productId)
    }

}