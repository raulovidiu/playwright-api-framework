import { clearCart } from "@/fixtures/helpers/cart.helper.js";
import { addProductToCart } from "@/fixtures/helpers/product.helper.js";
import {
	CartAddResponseSchema,
	CartClearResponseSchema,
	CartDeleteItemResponseSchema,
	CartResponseSchema,
	CartUpdateResponseSchema,
} from "@/fixtures/schemas/schemas.js";
import type {
	CartAddResponse,
	CartClearResponse,
	CartDeleteItemResponse,
	CartResponse,
	CartUpdateResponse,
} from "@/fixtures/schemas/type-guards.js";
import { expect, test } from "@/fixtures/test-options.api.js";

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
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartResponseSchema", async () => {
				expect(CartResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("items array is empty and total is '0.00'", async () => {
				expect(responseBody.items.length).toBe(0);
				expect(responseBody.total).toBe("0.00");
			});
		});

		test("Validate Cart With Items Returns 200 With All Items And Correct Total", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartResponse;

			await test.step("Seed cart with a valid product to ensure line items exist", async () => {
				await addProductToCart(apiRequest, 1, 2);
			});

			await test.step("GET /api/cart → status 200", async () => {
				const { status, body } = await apiRequest<CartResponse>({
					method: "GET",
					url: "/api/cart",
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartResponseSchema", async () => {
				expect(CartResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("Cart contains the seeded items", async () => {
				expect(responseBody.items.length).toBeGreaterThan(0);
			});

			await test.step("Verify item details match the seeded values", async () => {
				const item1 = responseBody.items.find((i) => i.productId === 1);
				expect(item1).toBeDefined();
				expect(item1?.quantity).toBe(2);
			});

			await test.step("Total field is populated as a non-zero string", async () => {
				expect(typeof responseBody.total).toBe("string");
				expect(parseFloat(responseBody.total)).toBeGreaterThan(0);
			});
		});
	});

	test.describe("POST /api/cart", () => {
		test("Validate Adding A New Product To Cart Returns 200", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartAddResponse;

			await test.step("POST /api/cart - add item via product helper → status 200", async () => {
				const { status, body } = await apiRequest<CartAddResponse>({
					method: "POST",
					url: "/api/cart",
					body: { productId: 1, quantity: 1 },
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

			await test.step("Cart array contains the added item with correct quantity", async () => {
				expect(responseBody.cart.length).toBe(1);
				const [firstCartItem] = responseBody.cart;
				expect(firstCartItem).toBeDefined();
				expect(firstCartItem?.productId).toBe(1);
				expect(firstCartItem?.quantity).toBe(1);
			});
		});

		test("Validate Adding An Already Existing Product Increments Its Quantity", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartAddResponse;

			await test.step("Seed cart with initial item using product helper", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/cart - add the same item again → status 200", async () => {
				const { status, body } = await apiRequest<CartAddResponse>({
					method: "POST",
					url: "/api/cart",
					body: { productId: 1, quantity: 2 },
				});

				responseStatus = status;
				responseBody = body;

				expect(responseStatus).toBe(200);
			});

			await test.step("Response body matches CartAddResponseSchema", async () => {
				expect(CartAddResponseSchema.parse(responseBody)).toBeTruthy();
			});

			await test.step("Cart item quantity is incremented correctly", async () => {
				expect(responseBody.cart.length).toBe(1);
				const [firstCartItem] = responseBody.cart;
				expect(firstCartItem).toBeDefined();
				expect(firstCartItem?.productId).toBe(1);
				expect(firstCartItem?.quantity).toBe(3);
			});
		});
	});

	test.describe("PUT /api/cart/:productId", () => {
		test("Validate Updating An Item Quantity Returns 200", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartUpdateResponse;

			await test.step("Seed cart with initial item using product helper", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("PUT /api/cart/1 - update quantity to 5 → status 200", async () => {
				const { status, body } = await apiRequest<CartUpdateResponse>({
					method: "PUT",
					url: "/api/cart/1",
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

			await test.step("Cart array reflects the updated quantity", async () => {
				expect(responseBody.cart.length).toBe(1);
				const [firstCartItem] = responseBody.cart;
				expect(firstCartItem).toBeDefined();
				expect(firstCartItem?.productId).toBe(1);
				expect(firstCartItem?.quantity).toBe(5);
			});
		});
	});

	test.describe("DELETE /api/cart/:productId", () => {
		test("Validate Deleting An Item Removes It From Cart Array", async ({
			apiRequest,
		}) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartDeleteItemResponse;

			await test.step("Seed cart with an item in the execution context", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("DELETE /api/cart/1 - remove item → status 200", async () => {
				const { status, body } = await apiRequest<CartDeleteItemResponse>({
					method: "DELETE",
					url: "/api/cart/1",
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

			await test.step("Cart array is now empty", async () => {
				expect(responseBody.cart.length).toBe(0);
			});
		});
	});

	test.describe("DELETE /api/cart", () => {
		test("Validate Clearing Cart Removes All Items", async ({ apiRequest }) => {
			let responseStatus: number = 0;
			let responseBody = {} as CartClearResponse;

			await test.step("Seed cart with items in the execution context", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("DELETE /api/cart → status 200", async () => {
				const { status, body } = await apiRequest<CartClearResponse>({
					method: "DELETE",
					url: "/api/cart",
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
	});
});
