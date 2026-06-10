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


// Cart schemas

// Reusable shape for a single cart line item.
// The GET /api/cart endpoint returns an embedded `product` object alongside
// productId and quantity; write endpoints (POST, PUT, DELETE) return only
// productId and quantity. Making `product` optional covers both cases.
const CartItemSchema = z.strictObject({
	productId: z.number().int().positive(),
	quantity: z.number().int().positive(),
	product: z.strictObject({
		id: z.number().int(),
		name: z.string(),
		price: z.number().positive(),
		category: z.string(),
		image: z.string(),
		stock: z.number().int().nonnegative(),
	}).optional(),
});

// Schema for GET /api/cart — { items: CartItem[], total: string }
export const CartResponseSchema = z.strictObject({
	items: z.array(CartItemSchema),
	total: z.string(),
});

// Schema for POST /api/cart — { message, cart: CartItem[] }
export const CartAddResponseSchema = z.strictObject({
	message: z.string(),
	cart: z.array(CartItemSchema),
});

// Schema for PUT /api/cart/:productId — { message, cart: CartItem[] }
export const CartUpdateResponseSchema = z.strictObject({
	message: z.string(),
	cart: z.array(CartItemSchema),
});

// Schema for DELETE /api/cart/:productId — { message, cart: CartItem[] }
export const CartDeleteItemResponseSchema = z.strictObject({
	message: z.string(),
	cart: z.array(CartItemSchema),
});

// Schema for DELETE /api/cart (clear all)
// The API actually returns the same shape as GET /api/cart: { items, total }
export const CartClearResponseSchema = z.strictObject({
	message: z.string(),
});
