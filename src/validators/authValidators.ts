/** @format */

import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userSignUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  educationLevel: z.string().min(1),
  specialty: z.string().min(1),
});

export const companySignUpSchema = z.object({
  companyName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserSignUpInput = z.infer<typeof userSignUpSchema>;
export type CompanySignUpInput = z.infer<typeof companySignUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
