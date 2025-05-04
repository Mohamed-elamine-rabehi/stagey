
import { Router } from "express";
import userRoute from "./auth";

const router = Router();

router.use("/user", userRoute);

export default router;
