import { Router } from "express";
import {
  forgotPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusContoller,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = Router();

// Routing Login - Logout
router.post("/register", registerController);
router.post("/login", loginController);

// Test Routing
router.get("/test", requireSignIn, isAdmin, testController);

// Forgot password
router.post("/forgot-password", forgotPasswordController);

// Protect  User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// Protect Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// Update Profile User
router.put("/profile", requireSignIn, updateProfileController);

// Orders
router.get("/orders", requireSignIn, getOrdersController);

// All Orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Update Order Status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusContoller
);

export default router;
