/** @format */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

interface TokenPayload {
  id: number;
  role: "user" | "company";
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as TokenPayload;

    if (decoded.role === "user") {
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(401).json({ error: "Invalid token" });
      req.user = { ...user, role: "user" };
    } else {
      const company = await prisma.company.findUnique({
        where: { id: decoded.id },
      });
      if (!company) return res.status(401).json({ error: "Invalid token" });
      req.user = { ...company, role: "company" };
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
