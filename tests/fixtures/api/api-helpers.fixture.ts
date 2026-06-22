import { clearCart as clearCartFn } from "../helpers/cart.helper.js";
import { addProductToCart as addProductToCartFn } from "../helpers/product.helper.js";
import { test as uiApiRequestFixture } from "./ui-api-request.fixture.js";
import type { ApiRequestFn } from "../schemas/type-guards.js";

export type ApiHelperFixtures = {
	clearCart: () => Promise<void>;
	addProductToCart: (productId: number, quantity?: number) => Promise<void>;
};

/**
 * Exposes the existing API helpers (cart.helper.ts, product.helper.ts)
 * as ready-to-call fixtures, pre-bound to this test's apiRequest.
 * Keeps the helper functions themselves as the single source of truth —
 * this only wires them up, no duplicated logic, and no logic added to
 * page objects.
 */
export const test = uiApiRequestFixture.extend<ApiHelperFixtures>({
	clearCart: async ({ apiRequest }: { apiRequest: ApiRequestFn }, use) => {
		await use(() => clearCartFn(apiRequest));
	},

	addProductToCart: async ({ apiRequest }: { apiRequest: ApiRequestFn }, use) => {
		await use((productId: number, quantity = 1) =>
			addProductToCartFn(apiRequest, productId, quantity)
		);
	},
});
