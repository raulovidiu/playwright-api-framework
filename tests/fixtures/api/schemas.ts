import { z } from "zod";

export const ProductsSchema = z.array(
  z.object({
    id: z.number().int(),
    name: z.string(),
    price: z.number().positive(),
    category: z.string(),
    image: z.string(),
    stock: z.number().int().nonnegative(),
  }),
);

export const UserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    token: z.string(),
  }),
});

export const ErrorResponseSchema = z.object({
  errors: z.object({
    email: z.array(z.string()).optional(),
    username: z.array(z.string()).optional(),
    password: z.array(z.string()).optional(),
  }),
});
