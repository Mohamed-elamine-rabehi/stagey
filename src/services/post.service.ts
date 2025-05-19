/** @format */

import ExpressError from "../domain/Error";
import prisma from "../prisma/client";
import {
  FetchPostsInput,
  PostCrudInput,
  SearchPostsInput,
} from "../validators/post";
import { NotificationService } from "./notification.service";

export class PostService {
  private static readonly PAGE_SIZE = 10;

  static async fetchPosts(input: FetchPostsInput) {
    const { specialty, educationLevel, page } = input;
    const skip = (page - 1) * this.PAGE_SIZE;

    const where = {
      ...(specialty && { specialty }),
      ...(educationLevel && { educationLevel }),
    };

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: this.PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: { company: true },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / this.PAGE_SIZE),
        totalItems: totalCount,
      },
    };
  }

  static async searchPosts(input: SearchPostsInput) {
    const { query, educationLevel, startDate, endDate, page } = input;
    const skip = (page - 1) * this.PAGE_SIZE;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          specialty: { contains: query, mode: "insensitive" },
          ...(educationLevel && { educationLevel }),
          ...(startDate && { startDate: { gte: startDate } }),
          ...(endDate && { endDate: { lte: endDate } }),
        },
        skip,
        take: this.PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: { company: true },
      }),
      prisma.post.count({
        where: {
          specialty: { contains: query, mode: "insensitive" },
          ...(educationLevel && { educationLevel }),
          ...(startDate && { startDate: { gte: startDate } }),
          ...(endDate && { endDate: { lte: endDate } }),
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / this.PAGE_SIZE),
        totalItems: totalCount,
      },
    };
  }

  static async getPostWithCompany(postId: number) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { company: true },
    });

    if (!post) {
      throw new ExpressError("Post not found", 404);
    }

    return post;
  }

  static async createPost(companyId: number, input: PostCrudInput) {
    const post = await prisma.post.create({
      data: {
        ...input,
        longitude: input.location.longitude,
        latitude: input.location.latitude,
        companyId,
      },
    });

    // Send notifications to matching users
    await NotificationService.sendPostNotifications(post);

    return post;
  }

  static async updatePost(
    postId: number,
    companyId: number,
    input: PostCrudInput
  ) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new ExpressError("Post not found", 404);
    if (post.companyId !== companyId)
      throw new ExpressError("Unauthorized", 403);

    return prisma.post.update({
      where: { id: postId },
      data: {
        ...input,
        longitude: input.location.longitude,
        latitude: input.location.latitude,
      },
    });
  }

  static async deletePost(postId: number, companyId: number) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new ExpressError("Post not found", 404);
    if (post.companyId !== companyId)
      throw new ExpressError("Unauthorized", 403);

    await prisma.post.delete({ where: { id: postId } });
  }
}
