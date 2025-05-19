/** @format */

import prisma from "../prisma/client";
import { CompanyProfileInput } from "../validators/company";



export class CompanyService {
  static async updateProfile(companyId: number, input: CompanyProfileInput) {
    return prisma.company.update({
      where: { id: companyId },
      data: {
        companyName: input.companyName,
        description: input.description,
        longitude: input.location.longitude,
        latitude: input.location.latitude,
        address: input.address,
        phoneNumber: input.phoneNumber,
        email: input.email,
        website: input.website,
      },
    });
  }

  static async getCompanyPosts(companyId: number, page: number = 1) {
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { companyId },
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where: { companyId } }),
    ]);

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        totalItems: totalCount,
      },
    };
  }
}
