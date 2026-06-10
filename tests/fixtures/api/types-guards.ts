import type { z } from "zod";
import type {
	CartAddResponseSchema,
	CartClearResponseSchema,
	CartDeleteItemResponseSchema,
	CartResponseSchema,
	CartUpdateResponseSchema,
	ErrorResponseSchema,
	HealthSchema,
	ProductSchema,
	ProductsSchema,
	RegisterErrorSchema,
	RegisterSchema,
	UserSchema,
} from "./schemas.js";

/**
 * Parameters for making an API request.
 * @typedef {Object} ApiRequestParams
 * @property {'POST' | 'GET' | 'PUT' | 'DELETE'} method - The HTTP method to use.
 * @property {string} url - The endpoint URL for the request.
 * @property {string} [baseUrl] - The base URL to prepend to the endpoint.
 * @property {Record<string, unknown> | null} [body] - The request payload, if applicable.
 * @property {string} [headers] - Additional headers for the request.
 */
export type ApiRequestParams = {
	method: "POST" | "GET" | "PUT" | "DELETE";
	url: string;
	baseUrl?: string;
	body?: Record<string, unknown> | null;
	headers?: string;
};

/**
 * Response from an API request.
 * @template T
 * @typedef {Object} ApiRequestResponse
 * @property {number} status - The HTTP status code of the response.
 * @property {T} body - The response body.
 */
export type ApiRequestResponse<T = unknown> = {
	status: number;
	body: T;
};

// define the function signature as a type
export type ApiRequestFn = <T = unknown>(
	params: ApiRequestParams,
) => Promise<ApiRequestResponse<T>>;

// grouping them all together
export type ApiRequestMethods = {
	apiRequest: ApiRequestFn;
};

// Product types
export type ProductsResponse = z.infer<typeof ProductsSchema>;
export type ProductResponse = z.infer<typeof ProductSchema>;

// Health types
export type HealthResponse = z.infer<typeof HealthSchema>;

// User types
export type User = z.infer<typeof UserSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterSchema>;
export type RegisterErrorResponse = z.infer<typeof RegisterErrorSchema>;

// Cart types
export type CartResponse = z.infer<typeof CartResponseSchema>;
export type CartAddResponse = z.infer<typeof CartAddResponseSchema>;
export type CartUpdateResponse = z.infer<typeof CartUpdateResponseSchema>;
export type CartDeleteItemResponse = z.infer<typeof CartDeleteItemResponseSchema>;
export type CartClearResponse = z.infer<typeof CartClearResponseSchema>;
