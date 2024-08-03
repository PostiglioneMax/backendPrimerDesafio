import mongoose from 'mongoose';
import { config } from '../config/config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            dbName: "DataBase"
        });
        console.log("DB Online!!...");
    } catch (error) {
        console.log("Fallo la conexion, detalle:", error.message);
    }
};

export const disconnectDB = async () => {
    await mongoose.connection.close();
};
