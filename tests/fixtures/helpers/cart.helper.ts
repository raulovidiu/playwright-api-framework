import { BASE_URL } from "../../constants.js";
import { ApiRequestFn } from "../schemas/type-guards.js";

/**
 * Clears the cart before each test so every
 * No authorisation is needed — the cart is
 */
export async function clearCart(apiRequest: ApiRequestFn): Promise<void> {
	await apiRequest({ method: "DELETE", url: "/api/cart", baseUrl: BASE_URL });
}