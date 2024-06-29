import os from "os"


export function argumentosProducto(producto){
    let {title, description, price, category, ...otros}=producto
    return `Se han detectado args inválidos.
  Argumentos requeridos:
    - title: tipo string. Se ingresó ${title}
    - description: tipo string. Se ingresó ${description}
    - price: tipo string. Se ingresó ${price}
    - category: tipo string. Se ingresó ${category}
  
  Argumentos opcioneales:
    - alias, powers, publisher, team. Se ingresó ${JSON.stringify(otros)}
  
  Fecha: ${new Date().toUTCString()}
  Usuario: ${os.userInfo().username}
  Terminal: ${os.hostname()}`
  }