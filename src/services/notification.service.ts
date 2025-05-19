/** @format */

import { Post } from "@prisma/client";
import prisma from "../prisma/client";
import ExpressError from "../domain/Error";

export class NotificationService {
  static async getUserNotifications(userId: number, page: number = 1) {
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: { post: true },
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        totalItems: totalCount,
      },
    };
  }

  static async markAsRead(notificationId: number, userId: number) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new ExpressError("Notification not found", 404);
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  static async sendPostNotifications(post: Post) {
    // Find users whose specialty and education level match the post
    const matchingUsers = await prisma.user.findMany({
      where: {
        specialty: post.specialty,
        educationLevel: post.educationLevel,
      },
      select: { id: true },
    });

    // Create notifications for each matching user
    await prisma.notification.createMany({
      data: matchingUsers.map((user) => ({
        userId: user.id,
        postId: post.id,
        message: `New job posting in ${post.specialty}: ${post.title}`,
      })),
    });
  }
}
