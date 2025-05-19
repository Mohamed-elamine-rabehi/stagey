/** @format */

import prisma from "../prisma/client";



export class FavoriteService {
  static async toggleFavorite(userId: number, postId: number) {
    const existing = await prisma.favorite.findFirst({
      where: { userId, postId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    } else {
      await prisma.favorite.create({
        data: { userId, postId },
      });
      return { favorited: true };
    }
  }

  static async getUserFavorites(userId: number, page: number = 1) {
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    const [favorites, totalCount] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        skip,
        take: PAGE_SIZE,
        include: { post: { include: { company: true } } },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      favorites: favorites.map((fav) => fav.post),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        totalItems: totalCount,
      },
    };
  }
}
