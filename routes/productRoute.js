import { Router } from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  productFilterController,
  createProductController,
  deleteProductController,
  getIdProductController,
  getProductsController,
  updateProductController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";

const router = Router();

// Routes

// Create Product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  createProductController);

// Get Products
router.get(
  "/get-products",
  getProductsController);

// Get Products Id
router.get(
  "/get-products/:id",
  getIdProductController);

// Update Product
router.put(
  "/update-products/:id",
  requireSignIn,
  isAdmin,
  updateProductController);

// Delete Product
router.delete(
  "/delete-products/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// Filter Product
router.post(
  "/products-filters",
  productFilterController
);

// Search Product
router.get(
  "/search/:keyword",
  searchProductController
);

// Search Pruduct Similar
router.get(
  "/related-product/:pid/:cid",
  relatedProductController
);

// Product Category by Id Product
router.get(
  "/products-category/:id",
  productCategoryController
);

// Payment with braintree-token
router.get(
  "/braintree/token",
  braintreeTokenController
);

// Payment with braintree-payment
router.post(
  "/braintree/payment",
  requireSignIn,
  braintreePaymentController
);

export default router;
