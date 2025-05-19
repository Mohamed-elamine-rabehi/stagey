/** @format */

import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { companySignUpSchema, signInSchema, userSignUpSchema } from "../validators/authValidators";
import ExpressError from "../domain/Error";


export class AuthController {
  static async signIn(req: Request, res: Response) {
    const result = signInSchema.safeParse(req.body);
    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    const { token, user } = await AuthService.signIn(result.data);
    res.json({ token, user });
  }

  static async userSignUp(req: Request, res: Response) {
    const result = userSignUpSchema.safeParse(req.body);
    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    const { token, user } = await AuthService.userSignUp(result.data);
    res.status(201).json({ token, user });
  }

  static async companySignUp(req: Request, res: Response) {
    const result = companySignUpSchema.safeParse(req.body);
    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    const { token, company } = await AuthService.companySignUp(result.data);
    res.status(201).json({ token, company });
  }

  static async getCurrentUser(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ExpressError("No token provided", 401);
    }

    const user = await AuthService.getCurrentUser(token);
    res.json({ user });
  }
}
