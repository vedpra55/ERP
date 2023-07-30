import express from "express";
import {
  createUserByAdmin,
  getUsersBySubCompany,
  register,
  signin,
  updateUserRole,
  verifyLoggedinUser,
  verifyEmail,
  deleteUser,
  EditUserRole,
} from "../../controllers/system/auth.controller.js";
import {
  verifyAdminToken,
  verifyToken,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/signin", signin);
router.post("/createUser", verifyAdminToken, createUserByAdmin);
router.put("/updateRole", verifyAdminToken, updateUserRole);
router.get("/subCompanyUsers", verifyAdminToken, getUsersBySubCompany);
router.post("/verifyUser", verifyToken, verifyLoggedinUser);
router.get("/verify", verifyEmail);
router.put("/", verifyAdminToken, EditUserRole);
router.put("/delete", verifyAdminToken, deleteUser);

export default router;
