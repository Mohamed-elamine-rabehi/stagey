/** @format */

import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import ExpressError from "../domain/Error";
import {
  fetchPostsSchema,
  searchPostsSchema,
  postCrudSchema,
} from "../validators/post";

export class PostController {
  static async fetchPosts(req: Request, res: Response) {
    const result = fetchPostsSchema.safeParse({
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
    });

    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    res.json(await PostService.fetchPosts(result.data));
  }

  static async searchPosts(req: Request, res: Response) {
    const result = searchPostsSchema.safeParse({
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    });

    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    res.json(await PostService.searchPosts(result.data));
  }

  static async getPostWithCompany(req: Request, res: Response) {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) throw new ExpressError("Invalid post ID", 400);

    res.json(await PostService.getPostWithCompany(postId));
  }

  static async createPost(req: Request, res: Response) {
    const companyId = (req.user as any).user.id;

    // Create a mutable copy of the body
    const bodyWithParsedDates = { ...req.body };

    // Parse date strings to Date objects
    if (bodyWithParsedDates.startDate) {
      bodyWithParsedDates.startDate = new Date(bodyWithParsedDates.startDate);
    }
    if (bodyWithParsedDates.endDate) {
      bodyWithParsedDates.endDate = new Date(bodyWithParsedDates.endDate);
    }

    const result = postCrudSchema.safeParse(bodyWithParsedDates); // <-- Validate the modified body

    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    res.status(201).json(await PostService.createPost(companyId, result.data));
  }

  static async updatePost(req: Request, res: Response) {
    const companyId = (req.user as any).user.id;
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) throw new ExpressError("Invalid post ID", 400);

    // Create a mutable copy of the body
    const bodyWithParsedDates = {...req.body};

    // Parse date strings to Date objects
    if (bodyWithParsedDates.startDate) {
      bodyWithParsedDates.startDate = new Date(bodyWithParsedDates.startDate);
    }
    if (bodyWithParsedDates.endDate) {
      bodyWithParsedDates.endDate = new Date(bodyWithParsedDates.endDate);
    }

    // Extract longitude and latitude from location, if present
    if (bodyWithParsedDates.location) {
      bodyWithParsedDates.longitude = bodyWithParsedDates.location.longitude;
      bodyWithParsedDates.latitude = bodyWithParsedDates.location.latitude;
   delete bodyWithParsedDates.location;

    }
    const result = postCrudSchema.safeParse(bodyWithParsedDates);

    if (!result.success) {
      throw new ExpressError("Validation error", 400, result.error.flatten());
    }

    res.json(await PostService.updatePost(postId, companyId, result.data));
  }
  static async deletePost(req: Request, res: Response) {
    const companyId = (req.user as any).id;  // Now we can access id directly since we stored decoded.user
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) throw new ExpressError("Invalid post ID", 400);

    await PostService.deletePost(postId, companyId);
    res.status(204).send();
  }
  static async fetchCompanyPosts(req: Request, res: Response) {
    const companyId = (req.user as any).user.id; // Get companyId from authenticated user

    // Get page from query parameters, default to 1 if not provided
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    if (isNaN(page) || page < 1) {
      throw new ExpressError("Invalid page number", 400);
    }

    res.json(await PostService.fetchPostsByCompanyId(companyId, page));
  }

}
