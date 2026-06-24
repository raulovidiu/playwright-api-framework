import type { ApiRequestFn } from "../schemas/type-guards.js"; //

export async function addProductToCart(
	apiRequest: ApiRequestFn,
	productId: number,
	quantity: number
): Promise<void> {
	await apiRequest({
		method: "POST",
		url: "/api/cart",
		body: { productId, quantity },
	});
}
