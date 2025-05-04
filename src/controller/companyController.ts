/** @format */

import { Request, Response } from "express";
import { CompanyService } from "../services/company.service";
import { companyProfileSchema } from "../validators/company";
import ExpressError from "../domain/Error";


export class CompanyController {
  static async updateProfile(req: Request, res: Response) {
    const companyId = (req.user as any).id;
    const result = companyProfileSchema.safeParse(req.body);

    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    res.json(await CompanyService.updateProfile(companyId, result.data));
  }

  static async getCompanyPosts(req: Request, res: Response) {
    const companyId = (req.user as any).id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;

    res.json(await CompanyService.getCompanyPosts(companyId, page));
  }
}
