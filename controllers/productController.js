import slugify from "slugify";
import dotenv from "dotenv";
import braintree from "braintree";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

dotenv.config();

// Payment Gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, code, description, price, category, quantity, image } =
      req.body;
    const product = await productModel.create({
      name,
      code,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      image,
    });
    res.status(201).send({
      success: true,
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al crear producto",
    });
  }
};

// Get Products
export const getProductsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const itemsPerPage = 12; // Or whatever number of items you want per page
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const product = await productModel
      .find({})
      .skip(start)
      .limit(itemsPerPage)
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Productos encontrados exitosamente",
      count_Total: product.length,
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener todos los productos",
    });
  }
};

// Get Product Id
export const getIdProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.id })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Producto encontrado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener el producto",
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Producto eliminado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al eliminar el producto",
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Producto actualizado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al actualizar el producto",
    });
  }
};

// Filter Product
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const product = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "Productos encontrados exitosamente",
      product,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error al filtrar los productos",
      error,
    });
  }
};

// Search Product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).send(results);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error al buscar los productos",
      error,
    });
  }
};

// Similar Products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const product = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Productos similares encontrados exitosamente",
      product,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error al obtener los productos similares",
      error,
    });
  }
};

// Product by Category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.id });
    const product = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Productos encontrados exitosamente",
      category,
      product,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error al obtener los productos",
      error,
    });
  }
};

// Payment Gateway Api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};