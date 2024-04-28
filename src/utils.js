import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//  {
//      "title": "maxi probando",
//      "description":"almacenamientou",
//      "code":"123asd",
//      "price": 1890,
//      "status": true,
//      "category": "Remeras Oversize"
//  }

// {
//     "title": "Producto de ejemplo",
//     "description": "Descripción del producto",
//     "price": 100,
//     "category": "Electrónicos"
// }

// http://localhost:3000/products/66232384a1def87e67c67c19/add-to-cart