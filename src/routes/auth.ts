/** @format */

import express from "express";
import { AuthController } from "../controller/authController";

const router = express.Router();

router.post("/signin", AuthController.signIn);
router.post("/signup/student", AuthController.userSignUp);
router.post("/signup/company", AuthController.companySignUp);
router.get("/me", AuthController.getCurrentUser);

export default router;
