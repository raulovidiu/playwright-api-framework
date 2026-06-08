import { z } from "zod";

export const ProductsSchema = z.array(
  z.strictObject({
    id: z.number().int(),
    name: z.string(),
    price: z.number().positive(),
    category: z.string(),
    image: z.string(),
    stock: z.number().int().nonnegative(),
  }),
);

export const ProductSchema = z.strictObject({
  id: z.number().int(),
  name: z.string(),
  price: z.number().positive(),
  category: z.string(),
  image: z.string(),
  stock: z.number().int().nonnegative(),
});

export const HealthSchema = z.strictObject({
	"status": z.string(),
	"timestamp": z.iso.datetime(),
});

export const UserSchema = z.object({
  user: z.strictObject({
    email: z.string().email(),
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    token: z.string(),
  }),
});

export const ErrorResponseSchema = z.object({
  errors: z.strictObject({
    email: z.array(z.string()).optional(),
    username: z.array(z.string()).optional(),
    password: z.array(z.string()).optional(),
  }),
});

// Schema for POST /api/register — matches { message, user: { id, email, name } }
export const RegisterSchema = z.object({
  message: z.string(),
  user: z.strictObject({
    id: z.number().int().positive(),
    email: z.string().email(),
    name: z.string(),
  }),
});

// Schema for /api/register error responses — { error: string }
export const RegisterErrorSchema = z.object({
  error: z.string(),
});
