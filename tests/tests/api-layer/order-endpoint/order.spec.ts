import { BASE_URL } from "../../../constants.js";
import { addProductToCart } from "../../../fixtures/api/helpers/product.helper.js";
import {
	CheckoutResponseSchema,
	OrderItemsResponseSchema,
} from "../../../fixtures/api/schemas.js";
import type {
	CheckoutResponse,
	OrderItemsResponse,
} from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";
import { shippingData } from "../../../test-data/shipping-data.js";

test.describe("Order API - Nominal Conditions", () => {
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
		});

		await test.step("Response body matches OrderItemResponseSchema", async () => {
			expect(OrderItemsResponseSchema.parse(orderBody)).toBeTruthy();
		});
	});
});
