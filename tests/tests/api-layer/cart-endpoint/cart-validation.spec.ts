import { BASE_URL } from "../../../constants.js";
import { clearCart } from "../../../fixtures/api/helpers/cart.helper.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";

test.describe("Cart API - Negative Cases", () => {

	test.describe("POST /api/cart", () => {
		test("Validate Adding Non-Existent Product Returns 404", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/cart with productId 999999 (non-existent) → status 404", async () => {
				const { status } = await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 999999, quantity: 1 },
				});

				expect(status).toBe(404);
			});
		});

		test("Validate Adding Item Without productId Returns 404", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/cart without productId field → status 404", async () => {
				const { status } = await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { quantity: 1 },
				});

				expect(status).toBe(404);
			});
		});

		test("Validate Adding Item Without quantity Returns 200", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/cart without quantity field → status 200", async () => {
				const { status } = await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1 },
				});

				expect(status).toBe(200);
			});
		});

		test("Validate Adding Item With Zero Quantity", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/cart with quantity 0 → status 200", async () => {
				const { status } = await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 0 },
				});

				expect(status).toBe(200);
			});
		});

		test("Validate Adding Item With Negative Quantity", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/cart with quantity -1 → status 200", async () => {
				const { status } = await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: -1 },
				});

				expect(status).toBe(200);
			});
		});

		test("Validate Adding Item With Empty Body Returns 404", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/cart with empty body → status 404", async () => {
				const { status } = await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: {},
				});

				expect(status).toBe(404);
			});
		});
	});

	test.describe("PUT /api/cart/:productId", () => {
		test("Validate Updating Non-Existent Cart Item Returns 404", async ({
			apiRequest,
		}) => {
			await test.step("Clear cart to guarantee the target item does not exist", async () => {
				await clearCart(apiRequest);
			});

			await test.step("PUT /api/cart/999999 (item not in cart) → status 404", async () => {
				const { status } = await apiRequest({
					method: "PUT",
					url: "/api/cart/999999",
					baseUrl: BASE_URL,
					body: { quantity: 3 },
				});

				expect(status).toBe(404);
			});
		});

		test("Validate Updating Cart Item With Zero Quantity", async ({
			apiRequest,
		}) => {
			await test.step("Clear cart and seed item (productId: 1, quantity: 2)", async () => {
				await clearCart(apiRequest);
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 2 },
				});
			});

			await test.step("PUT /api/cart/1 with quantity 0 → status 200", async () => {
				const { status } = await apiRequest({
					method: "PUT",
					url: "/api/cart/1",
					baseUrl: BASE_URL,
					body: { quantity: 0 },
				});

				expect(status).toBe(200);
			});
		});

		test("Validate Updating Cart Item Without quantity", async ({
			apiRequest,
		}) => {
			await test.step("Clear cart and seed item (productId: 1, quantity: 1)", async () => {
				await clearCart(apiRequest);
				await apiRequest({
					method: "POST",
					url: "/api/cart",
					baseUrl: BASE_URL,
					body: { productId: 1, quantity: 1 },
				});
			});

			await test.step("PUT /api/cart/1 with empty body → status 200", async () => {
				const { status } = await apiRequest({
					method: "PUT",
					url: "/api/cart/1",
					baseUrl: BASE_URL,
					body: {},
				});

				expect(status).toBe(200);
			});
		});
	});

	test.describe("DELETE /api/cart/:productId", () => {
		test("Validate Removing Non-Existent Cart Item", async ({
			apiRequest,
		}) => {
			await test.step("Clear cart to guarantee the target item does not exist", async () => {
				await clearCart(apiRequest);
			});

			await test.step("DELETE /api/cart/999999 (item not in cart) → status 200", async () => {
				const { status } = await apiRequest({
					method: "DELETE",
					url: "/api/cart/999999",
					baseUrl: BASE_URL,
				});

				expect(status).toBe(200);
			});
		});
	});

});
