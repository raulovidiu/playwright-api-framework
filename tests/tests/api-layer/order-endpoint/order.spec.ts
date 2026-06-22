import { BASE_URL } from "@/constants.js";
import { clearCart } from "@/fixtures/helpers/cart.helper.js";
import { addProductToCart } from "@/fixtures/helpers/product.helper.js";
import {
	CheckoutResponseSchema,
	OrderItemsResponseSchema,
} from "@/fixtures/schemas/schemas.js";
import type {
	CheckoutResponse,
	OrderItemsResponse,
} from "@/fixtures/schemas/type-guards.js";
import { expect, test } from "@/fixtures/test-options.api.js";
import { shippingData } from "@/test-data/shipping-data.js";
import { saveArtifact } from "@/utils/save-artifact.js";

test.describe("Order & Checkout API - Nominal Conditions", () => {
	test.beforeEach(async ({ apiRequest }) => {
		await test.step("Clear cart to guarantee a known empty state", async () => {
			await clearCart(apiRequest);
		});
	});

	test("Validate Placing Order With One Product In Cart Returns 200 And Order Details", async ({
		apiRequest,
	}) => {
		let checkoutStatus: number = 0;
		let checkoutBody = {} as CheckoutResponse;
		let createdOrderId: number;

		let orderStatus: number;
		let orderBody: OrderItemsResponse;

		await test.step("Seed cart using product helper (productId: 1, quantity: 2)", async () => {
			await addProductToCart(apiRequest, 1, 2);
		});

		await test.step("Place Order with One Product → status 200", async () => {
			const { status, body } = await apiRequest<CheckoutResponse>({
				method: "POST",
				url: "/api/checkout",
				baseUrl: BASE_URL,
				body: { shipping: shippingData },
			});

			checkoutStatus = status;
			checkoutBody = body;
			createdOrderId = checkoutBody.order.id;

			expect(checkoutStatus).toBe(200);
		});

		await test.step("Response body matches CheckoutResponseSchema", async () => {
			expect(CheckoutResponseSchema.parse(checkoutBody)).toBeTruthy();
		});

		await test.step("Response contains success message 'Order placed successfully'", async () => {
			expect(checkoutBody.message).toBe("Order placed successfully");
		});

		await test.step("Order items array contains exactly one entry with correct details", async () => {
			expect(checkoutBody.order.items.length).toBe(1);
			expect(checkoutBody.order.items[0]!.productId).toBe(1);
			expect(checkoutBody.order.items[0]!.quantity).toBe(2);
		});

		await test.step("Order contains correct shipping information", async () => {
			expect(checkoutBody.order.shipping).toEqual(shippingData);
		});

		await test.step("Interogate Placed Order", async () => {
			const { status, body } = await apiRequest<OrderItemsResponse>({
				method: "GET",
				url: `/api/orders/${createdOrderId}`,
				baseUrl: BASE_URL,
			});
			orderStatus = status;
			orderBody = body;

			expect(orderStatus).toBe(200);

			// Capture Placed Order Information
			await saveArtifact("placed-order", checkoutBody);
		});

		await test.step("Response body matches OrderItemResponseSchema", async () => {
			expect(OrderItemsResponseSchema.parse(orderBody)).toBeTruthy();
		});
	});

	test("Validate Placing Order With Multiple Products In Cart Returns 200 And Order Details", async ({
		apiRequest,
	}) => {
		let checkoutStatus: number = 0;
		let checkoutBody = {} as CheckoutResponse;
		let createdOrderId: number;

		let orderStatus: number;
		let orderBody: OrderItemsResponse;

		await test.step("Seed cart using product helper for product 2", async () => {
			await addProductToCart(apiRequest, 2, 1);
		});

		await test.step("Seed cart using product helper for product 4", async () => {
			await addProductToCart(apiRequest, 4, 1);
		});

		await test.step("Place Order with Multiple Products → status 200", async () => {
			const { status, body } = await apiRequest<CheckoutResponse>({
				method: "POST",
				url: "/api/checkout",
				baseUrl: BASE_URL,
				body: { shipping: shippingData },
			});

			checkoutStatus = status;
			checkoutBody = body;
			createdOrderId = checkoutBody.order.id;

			expect(checkoutStatus).toBe(200);
		});

		await test.step("Response body matches CheckoutResponseSchema", async () => {
			expect(CheckoutResponseSchema.parse(checkoutBody)).toBeTruthy();
		});

		await test.step("Response contains success message 'Order placed successfully'", async () => {
			expect(checkoutBody.message).toBe("Order placed successfully");
		});

		await test.step("Order items array contains all distinct products added to cart", async () => {
			expect(checkoutBody.order.items.length).toBe(2);

			const productIds = checkoutBody.order.items.map((item) => item.productId);
			expect(productIds).toContain(2);
			expect(productIds).toContain(4);
		});

		await test.step("Order contains correct shipping information", async () => {
			expect(checkoutBody.order.shipping).toEqual(shippingData);
		});

		await test.step("Interogate Placed Order", async () => {
			const { status, body } = await apiRequest<OrderItemsResponse>({
				method: "GET",
				url: `/api/orders/${createdOrderId}`,
				baseUrl: BASE_URL,
			});
			orderStatus = status;
			orderBody = body;

			expect(orderStatus).toBe(200);
		});

		await test.step("Response body matches OrderItemResponseSchema", async () => {
			expect(OrderItemsResponseSchema.parse(orderBody)).toBeTruthy();
		});
	});
});
