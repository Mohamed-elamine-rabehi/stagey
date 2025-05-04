/** @format */

import "dotenv/config";
import express, { Request, Response } from "express";
import apiRoute from "./routes";
import ErrorController from "./controller/errorController";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.get("/", (req, res, next) => {
  console.log("Hello, World!");
  res.status(200).json({ message: "Hello, World!" });
  return;
});


app.use("/api", apiRoute);
app.use(ErrorController.errorMiddleware);

  
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is up running on port ${PORT}`);
  });
}

export default app;
