import dotenv from "dotenv"
import path from "path"

dotenv.config(
    {
        override:true, path:"./.env"
    }
)

export const config={
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "mongodb+srv://postisama22:maxi123@cluster0.hjmvuac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  PERSISTENCE: process.env.PERSISTENCE||"MONGO",
  MODE: process.env.MODE || "DEV"
}