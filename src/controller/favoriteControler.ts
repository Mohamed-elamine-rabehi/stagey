/** @format */

import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service";
import ExpressError from "../domain/Error";

export class FavoriteController {
  static async toggleFavorite(req: Request, res: Response) {
    const userId = (req.user as any).id;
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) throw new ExpressError("Invalid post ID", 400);

    res.json(await FavoriteService.toggleFavorite(userId, postId));
  }

  static async getUserFavorites(req: Request, res: Response) {
    const userId = (req.user as any).id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;

    res.json(await FavoriteService.getUserFavorites(userId, page));
  }
}
