/** @format */

import { z } from "zod";

export const companyProfileSchema = z.object({
  companyName: z.string().min(3),
  description: z.string().optional(),
  location: z.object({
    longitude: z.number(),
    latitude: z.number(),
  }),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
  website: z.string().url().optional(),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
