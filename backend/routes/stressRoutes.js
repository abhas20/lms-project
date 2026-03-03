import express from "express";
import { analyzeStress } from "../controllers/stressController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/analyze", isAuth, analyzeStress);

export default router;