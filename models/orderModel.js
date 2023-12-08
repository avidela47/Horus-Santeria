import mongoose from "mongoose";

const orderCollection = "Order"

const orderSchema = new mongoose.Schema(
    {
        products: [
          {
            type: mongoose.ObjectId,
            ref: "Product",
          },
        ],
        payment: {},
        buyer: {
          type: mongoose.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          default: "No Procesado",
          enum: ["No Procesado", "Procesando", "Enviado", "Entregado", "Cancelado"],
        },
      },
      { timestamps: false }
    );

export const Order = mongoose.model(orderCollection,orderSchema)

export default Order;