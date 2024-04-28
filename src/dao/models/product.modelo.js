import mongoose from "mongoose";
import  paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    availability: { type: Boolean, default: true },
},
{
    timestamps:true, strict:false
}
);

productSchema.plugin(paginate)

export const modeloProduct = mongoose.model("Product", productSchema);

export default modeloProduct;
