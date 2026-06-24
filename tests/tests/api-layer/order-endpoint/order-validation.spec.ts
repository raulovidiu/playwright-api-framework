import { clearCart } from "@/fixtures/helpers/cart.helper.js";
import { addProductToCart } from "@/fixtures/helpers/product.helper.js";
import { expect, test } from "@/fixtures/test-options.api.js";
import { shippingData } from "@/test-data/shipping-data.js";

test.describe("Order API - Negative Cases", () => {
	test.describe("POST /api/checkout - Order Placement Validations", () => {
		test.beforeEach(async ({ apiRequest }) => {
			await test.step("Clear cart to guarantee a known empty state", async () => {
				await clearCart(apiRequest);
			});
		});

		test("Validate Placing Order With Empty Cart Returns 400", async ({
			apiRequest,
		}) => {
			await test.step("POST /api/checkout with empty cart → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					body: { shipping: shippingData },
				});

				expect(status).toBe(400);
				expect(body.error).toBe("Cart is empty");
			});
		});

		test("Validate Placing Order Without Shipping Information Returns 400", async ({
			apiRequest,
		}) => {
			await test.step("Seed cart using product helper (productId: 1, quantity: 1)", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing shipping object → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					body: {}, // Missing 'shipping' key entirely
				});

				expect(status).toBe(400);
				expect(body.error).toBe("Shipping information required");
			});
		});

		test("Validate Placing Order With Missing Address Returns 400", async ({
			apiRequest,
		}) => {
			await test.step("Seed cart using product helper (productId: 1, quantity: 1)", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing address field → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					body: {
						shipping: {
							city: shippingData.city,
							zip: shippingData.zip,
							// address is missing
						},
					},
				});

				expect(status).toBe(400);
				expect(body.error).toBe("Shipping information required");
			});
		});

		test("Validate Placing Order With Missing City Returns 400", async ({
			apiRequest,
		}) => {
			await test.step("Seed cart using product helper (productId: 1, quantity: 1)", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing city field → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					body: {
						shipping: {
							address: shippingData.address,
							zip: shippingData.zip,
							// city is missing
						},
					},
				});

				expect(status).toBe(400);
				expect(body.error).toBe("Shipping information required");
			});
		});

		test("Validate Placing Order With Missing Zip Returns 400", async ({
			apiRequest,
		}) => {
			await test.step("Seed cart using product helper (productId: 1, quantity: 1)", async () => {
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing zip field → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					body: {
						shipping: {
							address: shippingData.address,
							city: shippingData.city,
							// zip is missing
						},
					},
				});

				expect(status).toBe(400);
				expect(body.error).toBe("Shipping information required");
			});
		});
	});

	test.describe("GET /api/orders/:id - Order Retrieval Validations", () => {
		test("Validate Requesting Non-Existent Order ID Returns 404", async ({
			apiRequest,
		}) => {
			const nonExistentOrderId = 999999;

			await test.step(`GET /api/orders/${nonExistentOrderId} → status 404`, async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "GET",
					url: `/api/orders/${nonExistentOrderId}`,
				});

				expect(status).toBe(404);
				expect(body.error).toBe("Order not found");
			});
		});
	});
});
