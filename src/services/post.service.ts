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
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        longitude: input.location.longitude, // Extract longitude from the location object
        latitude: input.location.latitude,   // Extract latitude from the location object
        specialty: input.specialty,
        educationLevel: input.educationLevel,
        skills: input.skills,
        // Connect the post to the company using the 'company' relation
        company: {
          connect: {
            id: companyId, // Use the companyId obtained from the authenticated user
          },
        },
        // Remove companyId here, as 'connect' handles the relation
        // Also removed ...input spread to be explicit about fields and avoid conflict with location
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
  static async fetchPostsByCompanyId(companyId: number, page: number = 1) {
    const skip = (page - 1) * this.PAGE_SIZE;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          companyId: companyId, // <-- Filter by company ID
        },
        skip,
        take: this.PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: { company: true }, // Include company details if needed on frontend
      }),
      prisma.post.count({
        where: {
          companyId: companyId,
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
}
