import { BASE_URL } from "@/constants.js";
import { clearCart } from "@/fixtures/api/helpers/cart.helper.js";
import { addProductToCart } from "@/fixtures/api/helpers/product.helper.js";
import { expect, test } from "@/fixtures/pom/test-options.api.js";
import { shippingData } from "@/test-data/shipping-data.js";

test.describe("Checkout API - Negative Cases", () => {
	test.describe("POST /api/checkout", () => {
		test("Validate Placing Order With Empty Cart Returns 400", async ({
			apiRequest,
		}) => {
			await test.step("Clear cart to guarantee an empty state", async () => {
				await clearCart(apiRequest);
			});

			await test.step("POST /api/checkout with empty cart → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					baseUrl: BASE_URL,
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
				await clearCart(apiRequest);
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing shipping object → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					baseUrl: BASE_URL,
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
				await clearCart(apiRequest);
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing address field → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					baseUrl: BASE_URL,
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
				await clearCart(apiRequest);
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing city field → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					baseUrl: BASE_URL,
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
				await clearCart(apiRequest);
				await addProductToCart(apiRequest, 1, 1);
			});

			await test.step("POST /api/checkout missing zip field → status 400", async () => {
				const { status, body } = await apiRequest<{ error: string }>({
					method: "POST",
					url: "/api/checkout",
					baseUrl: BASE_URL,
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
});
