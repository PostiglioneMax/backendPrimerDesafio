import Ticket from '../dao/models/ticket.modelo.js';
import { productosService } from './productos.service.js';

class TicketService {
  async generateTicket(code, amount, purchaser) {
    try {
      const ticket = new Ticket({ code, amount, purchaser });
      const createdTicket = await ticket.save();
      return createdTicket;
    } catch (error) {
      throw new Error(`Error generating ticket: ${error.message}`);
    }
  }

  async processPurchase(cartProducts, purchaser) {
    const successfulPurchaseIds = [];
    const failedPurchaseIds = [];

    for (const product of cartProducts) {
      const dbProduct = await productosService.obtenerProductoPorId(product._id);
      console.log("DB PRODUCCTTT!!!!....", dbProduct);

      if (dbProduct && dbProduct.stock >= product.quantity) {
        dbProduct.stock -= product.quantity;
        // await dbProduct.save();
        await productosService.actualizarProducto(product._id, {stock:dbProduct.stock})
        console.log("como quedo el stockk????...", dbProduct);
        successfulPurchaseIds.push(product._id);
        console.log("SUXESFULL:", successfulPurchaseIds);
      } else {
        failedPurchaseIds.push(product._id);
        console.log("FALLA2.....:", failedPurchaseIds);
      }
    }

    if (successfulPurchaseIds.length > 0) {
      const totalAmount = cartProducts.reduce((total, product) => {
        if (successfulPurchaseIds.includes(product._id)) {
          return total + product.price * product.quantity;
        }
        return total;
      }, 0);

      const ticket = await this.generateTicket(
        generateUniqueCode(),
        totalAmount,
        purchaser
      );

      const remainingProducts = cartProducts.filter(
        product => !successfulPurchaseIds.includes(product._id)
      );

      return { ticket, failedPurchaseIds, remainingProducts };
    } else {
      return { failedPurchaseIds, remainingProducts: cartProducts };
    }
  }
}

function generateUniqueCode() {
  return `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default TicketService;
