import express from "express";
import {
  createPurchaseOrder,
  deletePurchaseOrderProduct,
  editPurchaseOrder,
  getAllPurhcaseOrder,
  getSinglePurchaseOrder,
  handleOrderFullFill,
  handlePayment,
} from "../../controllers/transaction/purchaseOrder.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createPurchaseOrder);
router.get("/", verifyToken, getAllPurhcaseOrder);
router.put("/", verifyToken, editPurchaseOrder);
router.put("/fullFill", verifyToken, handleOrderFullFill);
router.post("/payment", verifyToken, handlePayment);
router.get("/id", verifyToken, getSinglePurchaseOrder);
router.put("/delete", verifyToken, deletePurchaseOrderProduct);

export default router;
