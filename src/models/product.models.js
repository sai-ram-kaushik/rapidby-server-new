import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },

      category: {
         type: mongoose.Schema.Types.String,
         ref: "Category",
         required: true,
      },

      imageUrl: {
         type: String,
         required: true,
      },

      stock: {
         type: Boolean,
         required: true,
      },

      amount: {
         type: String,
         required: true,
      },

      quantity: {
         type: String,
         required: true,
      },

      aboutProduct: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
