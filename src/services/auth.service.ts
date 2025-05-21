/** @format */

import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import {
  CompanySignUpInput,
  SignInInput,
  UserSignUpInput,
} from "../validators/authValidators";
import prisma from "../prisma/client";
import ExpressError from "../domain/Error";
import JWT from "./utils/jwt";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  static async signIn(input: SignInInput) {
    const user =
      (await prisma.user.findUnique({ where: { email: input.email } })) ||
      (await prisma.company.findUnique({ where: { email: input.email } }));

    if (!user) {
      throw new ExpressError("Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
      throw new ExpressError("Invalid credentials", 401);
    }

    const token = JWT.generateToken({
      id: user.id,
      email: user.email,
      role: "companyName" in user ? "company" : "user",
      specialty: "specialty" in user ? user.specialty : undefined,
    });

    const { password, createdAt, updatedAt, ...safeUser } = user;

    return {
      token,
      user: safeUser,
    };
  }

  static async userSignUp(input: UserSignUpInput) {
    const exists = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (exists) {
      throw new ExpressError("Email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        password: hashedPassword,
        educationLevel: input.educationLevel,
        specialty: input.specialty,
      },
    });

    const token = JWT.generateToken({
      id: user.id,
      email: user.email,
      role: "user",
      specialty: user.specialty,

    });
    console.log(token); // Debugging line
    return { token, user: { id: user.id, email: user.email } };
  }

  static async companySignUp(input: CompanySignUpInput) {
    const exists = await prisma.company.findUnique({
      where: { email: input.email },
    });
    if (exists) {
      throw new ExpressError("Email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const company = await prisma.company.create({
      data: {
        companyName: input.companyName,
        email: input.email,
        password: hashedPassword,
        longitude: 0, // Provide a default or input value
        latitude: 0, // Provide a default or input value
      },
    });

    const token = JWT.generateToken({
      id: company.id,
      email: company.email,
      role: "company",
    });
    return { token, company: { id: company.id, email: company.email } };
  }

  static async getCurrentUser(token: string) {
    try {
      const decoded = JWT.verifyToken(token);
      if (!decoded) {
        throw new ExpressError("Invalid token", 401);
      }
      if (decoded.user.role === "user") {
        return await prisma.user.findUnique({
          where: { id: decoded.user.id },
          select: {
            id: true,
            email: true,
            fullName: true,
            educationLevel: true,
            specialty: true,
          },
        });
      } else {
        return await prisma.company.findUnique({
          where: { id: decoded.user.id },
          select: { id: true, email: true, companyName: true },
        });
      }}
 catch (error) {
      throw new ExpressError("Invalid token", 401);
    }
  }
}


