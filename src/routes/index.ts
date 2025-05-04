/** @format */

import { Router } from "express";
import userRoute from "./auth";
import postRouter from "./post";
import favoriteRouter from "./favorite";
import notificationRouter from "./notification";
import companyRouter from "./company";

const router = Router();
router.use("/auth", userRoute);
router.use("/posts", postRouter);
router.use("/favorites", favoriteRouter);
router.use("/notifications", notificationRouter);
router.use("/company", companyRouter);

export default router;
