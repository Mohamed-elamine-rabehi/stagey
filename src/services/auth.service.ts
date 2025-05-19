/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  CompanySignUpInput,
  SignInInput,
  UserSignUpInput,
} from "../validators/authValidators";
import prisma from "../prisma/client";
import ExpressError from "../domain/Error";
import JWT from "./utils/jwt";
import { User, UserInput, LoginInput } from '../domain/user';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
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

    const token = jwt.sign({ userId: company.id }, JWT_SECRET, { expiresIn: '24h' });
    return { token, company: { id: company.id, email: company.email } };
  }

  static async getCurrentUser(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
        throw new ExpressError("Invalid token", 401);
      }

      if (decoded.role === "user") {
        return await prisma.user.findUnique({
          where: { id: decoded.id },
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
          where: { id: decoded.id },
          select: { id: true, email: true, companyName: true },
        });
      }
    } catch (error) {
      throw new ExpressError("Invalid token", 401);
    }
  }

  async signup(userData: UserInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async signin(loginData: LoginInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(loginData.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
