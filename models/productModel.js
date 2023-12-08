import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Product";

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
        type: String,
        required: true,
    },
    shipping: {
      type: Boolean,
    },
  },
  {
    timestamps: false,
  }
);

productsSchema.plugin(mongoosePaginate);
export const Product = mongoose.model(productsCollection, productsSchema);

export default Product;
