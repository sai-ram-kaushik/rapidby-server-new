import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
   {
      items: [
         {
            productId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Product",
               required: true,
            },
            name: {
               type: String,
               required: true,
            },

            imageUrl: {
               type: [String],
               required: true,
            },
            amount: {
               type: Number,
            },
         },
      ],

      orderBy: {
         type: String,
         required: true,
      },

      email: {
         type: String,
         required: true,
      },

      status: {
         type: String,
         default: "pending",
      },

      address: {
         type: String,
         required: true,
      },

      province: {
         type: String,
         required: true,
      },

      zipCode: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
