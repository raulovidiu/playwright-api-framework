import { clearCart } from "@/fixtures/helpers/cart.helper.js";
import { expect, test } from "@/fixtures/test-options.js";
import { cardData } from "@/test-data/card-data.js";
import { shippingData } from "@/test-data/shipping-data.js";

test.describe("Checkout Flow", () => {
	test.beforeEach(async ({ clearCart, addProductToCart }) => {
		await test.step("Clear cart and add a product via API", async () => {
			await clearCart();
			await addProductToCart(1, 1);
		});
	});

	test("Redirect to cart if cart is empty", async ({
		clearCart,
		checkoutPage,
		page,
	}) => {
		await test.step("Clear cart via API to ensure it is empty", async () => {
			await clearCart();
		});

		await test.step("Navigate to checkout page", async () => {
			await checkoutPage.navigate();
		});

		await test.step("Verify redirection back to cart page", async () => {
			await page.waitForURL("/cart.html");
		});
	});

	test("Display order summary details", async ({ checkoutPage }) => {
		await test.step("Navigate to checkout page", async () => {
			await checkoutPage.navigate();
		});

		await test.step("Verify order summary section visibility", async () => {
			await expect(checkoutPage.orderSummary).toBeVisible();
		});

		await test.step("Verify the item is listed in the summary", async () => {
			await expect(checkoutPage.orderItems).toHaveCount(1);
		});

		await test.step("Verify subtotal, tax, and total fields are displayed", async () => {
			await expect(checkoutPage.subtotal).toBeVisible();
			await expect(checkoutPage.tax).toBeVisible();
			await expect(checkoutPage.total).toBeVisible();
		});
	});

	test("Complete checkout successfully", async ({ checkoutPage }) => {
		await test.step("Navigate to checkout page", async () => {
			await checkoutPage.navigate();
		});

		await test.step("Fill form and submit order", async () => {
			await checkoutPage.completeCheckout(shippingData, cardData);
		});

		await test.step("Verify order confirmation modal and generated Order ID", async () => {
			await expect(checkoutPage.orderConfirmation).toBeVisible();
			await expect(checkoutPage.orderConfirmation).toContainText(
				"Order Confirmed",
			);
			await expect(checkoutPage.orderId).not.toBeEmpty();
		});
	});
});
