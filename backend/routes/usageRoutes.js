import express from "express";
import { updateUsage, resetContinuousUsage } from "../controllers/usageController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/update", isAuth, updateUsage);
router.post("/reset", isAuth, resetContinuousUsage);

export default router;