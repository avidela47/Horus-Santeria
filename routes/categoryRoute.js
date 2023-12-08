import { Router } from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getIdCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = Router();

// Routes

// Create Catgory
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// Update Category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// Get All Categoty
router.get("/get-category", getAllCategoryController);

// Get Category Id
router.get("/get-category/:slug", getIdCategoryController);

// Delete Category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;