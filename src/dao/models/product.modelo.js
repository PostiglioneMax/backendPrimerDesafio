import mongoose from "mongoose";

const productColl = "product";
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    availability: { type: Boolean, default: true },
});

export const modeloProduct = mongoose.model(productColl, productSchema);

export default Product;
