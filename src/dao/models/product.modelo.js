import { Admin } from "mongodb";
import mongoose from "mongoose";
import  paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    availability: { type: Boolean, default: true },
    stock: { type: Number, required: true }, 
    quantity: { type: Number, default: 1 },
    owner:{ type: String, default: "admin" },
},
{
    timestamps:true, strict:false
}
);

productSchema.plugin(paginate)

export const modeloProduct = mongoose.model("Product", productSchema);

export default modeloProduct;
