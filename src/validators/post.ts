/** @format */

import { z } from "zod";

// Common schemas
const locationSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
});

const periodSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

// Fetch posts schema
export const fetchPostsSchema = z.object({
  specialty: z.string().min(1).optional(),
  educationLevel: z.string().min(1).optional(),
  page: z.number().int().positive().default(1),
});

// Search schema
export const searchPostsSchema = z.object({
  query: z.string().min(1),
  educationLevel: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().positive().default(1),
});

// Post CRUD schema
export const postCrudSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDate: z.date(),
  endDate: z.date(),
  location: locationSchema,
  specialty: z.string().min(1),
  educationLevel: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
});

export type FetchPostsInput = z.infer<typeof fetchPostsSchema>;
export type SearchPostsInput = z.infer<typeof searchPostsSchema>;
export type PostCrudInput = z.infer<typeof postCrudSchema>;
