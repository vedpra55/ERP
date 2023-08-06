import express from "express";
import {
  SeedDeparment,
  SeedLocation,
  SeedSuppliers,
} from "../../controllers/test/seedData.js";

const router = express.Router();

router.get("/location", SeedLocation);
router.get("/deparment", SeedDeparment);
router.get("/supplier", SeedSuppliers);

export default router;
