import { BASE_URL } from "../../../constants.js";
import { clearCart } from "../../../fixtures/api/helpers/cart.helper.js";
import {
	CartAddResponseSchema,
	CartClearResponseSchema,
	CartDeleteItemResponseSchema,
	CartResponseSchema,
	CartUpdateResponseSchema,
} from "../../../fixtures/api/schemas.js";
import type {
	CartAddResponse,
	CartClearResponse,
	CartDeleteItemResponse,
	CartResponse,
	CartUpdateResponse,
} from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";

test.describe("Cart API - Nominal Conditions", () => {
	test.beforeEach(async ({ apiRequest }) => {
		await test.step("Clear cart to guarantee a known empty state", async () => {
			await clearCart(apiRequest);
		});
	});

	test.describe("GET /api/cart", () => {
		test("Validate Empty Cart Returns 200 With Empty Items Array", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartResponse;

			await test.step("GET /api/cart → status 200", async () => {
				const { status, body } = await apiRequest<CartResponse>({
					method: "GET",
					url: "/api/cart",
					baseUrl: BASE_URL,
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartResponseSchema", async () => {
				expect(CartResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("items array is empty", async () => {
				expect(responseBody.items).toEqual([]);
			});

			await test.step("total is '0.00'", async () => {
				expect(responseBody.total).toBe("0.00");
			});
		});

		test("Validate Cart Returns Added Items When Cart Is Non-Empty", async ({
			apiRequest,
		}) => {
			let responseBody = {} as CartResponse;

			await test.step("POST /api/cart — seed one item (productId: 1, quantity: 2)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 2 },
				});
			});

			await test.step("GET /api/cart → status 200", async () => {
				const { status, body } = await apiRequest<CartResponse>({
					method: "GET",
					url: "/api/cart",
					baseUrl: BASE_URL,
				});

				expect(status).toBe(200);
				responseBody = body;
			});

			await test.step("Response body matches CartResponseSchema", async () => {
				expect(CartResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("items array contains exactly one entry", async () => {
				expect(responseBody.items.length).toBe(1);
			});

			await test.step("item has correct productId and quantity", async () => {
				expect(responseBody.items[0]!.productId).toBe(1);
				expect(responseBody.items[0]!.quantity).toBe(2);
			});
		});
	});

	test.describe("POST /api/cart", () => {
		test("Validate Adding A Single Item Returns 200 With Updated Cart", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartAddResponse;

			await test.step("POST /api/cart with productId 1 and quantity 2 → status 200", async () => {
				const { status, body } = await apiRequest<CartAddResponse>({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 2 },
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartAddResponseSchema", async () => {
				expect(CartAddResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("Response contains success message 'Added to cart'", async () => {
				expect(responseBody.message).toBe("Added to cart");
			});

			await test.step("Cart contains exactly one entry", async () => {
				expect(responseBody.cart.length).toBe(1);
			});

			await test.step("Cart entry reflects the submitted productId and quantity", async () => {
				expect(responseBody.cart[0]!.productId).toBe(1);
				expect(responseBody.cart[0]!.quantity).toBe(2);
			});
		});

		test("Validate Adding Multiple Different Items Accumulates Them In The Cart", async ({
			apiRequest,
		}) => {
			let responseBody = {} as CartAddResponse;

			await test.step("POST /api/cart — add first item (productId: 1)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 1 },
				});
			});

			await test.step("POST /api/cart — add second item (productId: 2)", async () => {
				const { body } = await apiRequest<CartAddResponse>({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 2, quantity: 3 },
				});
				responseBody = body;
			});

			await test.step("Cart contains two distinct entries", async () => {
				expect(responseBody.cart.length).toBe(2);
			});

			await test.step("Both productIds are present in the cart", async () => {
				const productIds = responseBody.cart.map((item) => item.productId);
				expect(productIds).toContain(1);
				expect(productIds).toContain(2);
			});
		});
	});

	test.describe("PUT /api/cart/:productId", () => {
		test("Validate Updating Item Quantity Returns 200 With Correct Quantity", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartUpdateResponse;

			await test.step("POST /api/cart — seed item (productId: 1, quantity: 1)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 1 },
				});
			});

			await test.step("PUT /api/cart/1 with quantity 5 → status 200", async () => {
				const { status, body } = await apiRequest<CartUpdateResponse>({
					method: "PUT",
					url: "/api/cart/1",
					baseUrl: BASE_URL,
					body: { quantity: 5 },
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartUpdateResponseSchema", async () => {
				expect(CartUpdateResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("Response contains success message 'Cart updated'", async () => {
				expect(responseBody.message).toBe("Cart updated");
			});

			await test.step("Cart entry for productId 1 reflects the new quantity", async () => {
				const item = responseBody.cart.find((i) => i.productId === 1);
				expect(item).toBeDefined();
				expect(item!.quantity).toBe(5);
			});
		});

		test("Validate Updating Quantity To 1 Keeps Item In Cart", async ({
			apiRequest,
		}) => {
			let responseBody = {} as CartUpdateResponse;

			await test.step("POST /api/cart — seed item (productId: 1, quantity: 10)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 10 },
				});
			});

			await test.step("PUT /api/cart/1 with quantity 1 → status 200", async () => {
				const { body } = await apiRequest<CartUpdateResponse>({
					method: "PUT",
					url: "/api/cart/1",
					baseUrl: BASE_URL,
					body: { quantity: 1 },
				});
				responseBody = body;
			});

			await test.step("Response contains success message 'Cart updated'", async () => {
				expect(responseBody.message).toBe("Cart updated");
			});

			await test.step("Cart still contains productId 1 with quantity 1", async () => {
				const item = responseBody.cart.find((i) => i.productId === 1);
				expect(item).toBeDefined();
				expect(item!.quantity).toBe(1);
			});
		});
	});

	test.describe("DELETE /api/cart/:productId", () => {
		test("Validate Removing A Specific Item Returns 200 And Cart No Longer Contains It", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartDeleteItemResponse;

			await test.step("POST /api/cart — seed item (productId: 1, quantity: 1)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 1 },
				});
			});

			await test.step("DELETE /api/cart/1 → status 200", async () => {
				const { status, body } = await apiRequest<CartDeleteItemResponse>({
					method: "DELETE",
					url: "/api/cart/1",
					baseUrl: BASE_URL,
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartDeleteItemResponseSchema", async () => {
				expect(CartDeleteItemResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("Response contains success message 'Removed from cart'", async () => {
				expect(responseBody.message).toBe("Removed from cart");
			});

			await test.step("Removed productId 1 is no longer present in the returned cart", async () => {
				const item = responseBody.cart.find((i) => i.productId === 1);
				expect(item).toBeUndefined();
			});
		});

		test("Validate Removing One Item Leaves Other Items Intact", async ({
			apiRequest,
		}) => {
			let responseBody = {} as CartDeleteItemResponse;

			await test.step("POST /api/cart — seed two items (productId: 1 and productId: 2)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 1 },
				});
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 2, quantity: 2 },
				});
			});

			await test.step("DELETE /api/cart/1 — remove only productId 1", async () => {
				const { body } = await apiRequest<CartDeleteItemResponse>({
					method: "DELETE",
					url: "/api/cart/1",
					baseUrl: BASE_URL,
				});
				responseBody = body;
			});

			await test.step("productId 2 is still present in the cart", async () => {
				const item = responseBody.cart.find((i) => i.productId === 2);
				expect(item).toBeDefined();
				expect(item!.quantity).toBe(2);
			});

			await test.step("productId 1 is no longer present in the cart", async () => {
				const removed = responseBody.cart.find((i) => i.productId === 1);
				expect(removed).toBeUndefined();
			});
		});
	});

	test.describe("DELETE /api/cart", () => {
		test("Validate Clearing The Entire Cart Returns 200 And Empty Cart", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartClearResponse;

			await test.step("Seed cart with two items (productId: 1 and productId: 2)", async () => {
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 1 },
				});
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 2, quantity: 1 },
				});
			});

			await test.step("DELETE /api/cart → status 200", async () => {
				const { status, body } = await apiRequest<CartClearResponse>({
					method: "DELETE",
					url: "/api/cart",
					baseUrl: BASE_URL,
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartClearResponseSchema", async () => {
				expect(CartClearResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("Response contains success message 'Cart cleared'", async () => {
				expect(responseBody.message).toBe("Cart cleared");
			});
		});

		test("Validate Clearing An Already Empty Cart Returns 200", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartClearResponse;

			await test.step("DELETE /api/cart on an already-empty cart → status 200", async () => {
				const { status, body } = await apiRequest<CartClearResponse>({
					method: "DELETE",
					url: "/api/cart",
					baseUrl: BASE_URL,
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response contains success message 'Cart cleared'", async () => {
				expect(responseBody.message).toBe("Cart cleared");
			});
		});
	});
});
