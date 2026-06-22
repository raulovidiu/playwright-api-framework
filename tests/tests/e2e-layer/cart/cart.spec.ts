import { expect, test } from "@/fixtures/test-options.js";

test.describe("Shopping Cart", () => {
	test.beforeEach(async ({ clearCart, page }) => {
		await test.step("Clear cart via API and navigate to home page", async () => {
			await clearCart();
			await page.goto("/");
		});
	});

	test("Adds item to cart", async ({ cartPage }) => {
		await test.step("Add first product to cart", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Verify toast message appears", async () => {
			await expect(cartPage.toast).toContainText("Added to cart");
		});

		await test.step("Verify cart count updates", async () => {
			await expect(cartPage.cartCount.first()).toHaveText("1");
		});
	});

	test("Navigates to cart page", async ({ cartPage, page }) => {
		await test.step("Add item to cart", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Click cart link and verify redirection to cart page", async () => {
			await cartPage.goToCart();
			await expect(page).toHaveURL("/cart.html");
			await expect(cartPage.heading).toHaveText("Your Shopping Cart");
		});
	});

	test("Displays cart items correctly", async ({ cartPage }) => {
		await test.step("Add product to cart", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Navigate to cart page", async () => {
			await cartPage.navigate();
		});

		await test.step("Verify cart item is displayed with correct quantity", async () => {
			await expect(cartPage.cartItems).toHaveCount(1);
			await expect(cartPage.qtyValues).toHaveText("1");
		});
	});

	test("Updates item quantity", async ({ cartPage }) => {
		await test.step("Add product to cart", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Navigate to cart page", async () => {
			await cartPage.navigate();
		});

		await test.step("Increase quantity and verify it updates", async () => {
			await cartPage.increaseQuantity();
			await expect(cartPage.qtyValues).toHaveText("2");
		});
	});

	test("Removes item from cart", async ({ cartPage }) => {
		await test.step("Add product to cart", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Navigate to cart page", async () => {
			await cartPage.navigate();
		});

		await test.step("Remove item and verify empty cart message appears", async () => {
			await cartPage.removeFirstItem();
			await expect(cartPage.emptyCart).toBeVisible();
		});
	});

	test("Clears entire cart", async ({ cartPage }) => {
		await test.step("Add product to cart", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Navigate to cart page", async () => {
			await cartPage.navigate();
		});

		await test.step("Clear cart and verify it is empty", async () => {
			await cartPage.clearCart();
			await expect(cartPage.emptyCart).toBeVisible();
		});
	});

	test("Calculates correct totals", async ({ cartPage }) => {
		await test.step("Add item with known price", async () => {
			await cartPage.addFirstItemToCart();
		});

		await test.step("Navigate to cart page", async () => {
			await cartPage.navigate();
		});

		await test.step("Verify total", async () => {
			await expect(cartPage.total).toContainText("127.77");
		});

		await test.step("Buy one more of this product", async () => {
			await cartPage.increaseQuantity();
		});

		await test.step("Verify total amount was doubled", async () => {
			await expect(cartPage.total).toContainText("255.54");
		});
	});

	test("Shows empty cart message when cart is empty", async ({ cartPage }) => {
		await test.step("Navigate to cart page", async () => {
			await cartPage.navigate();
		});

		await test.step("Verify empty cart message and Start Shopping button are visible", async () => {
			await expect(cartPage.emptyCart).toBeVisible();
			await expect(cartPage.emptyCart).toContainText("Your cart is empty");
			await expect(cartPage.startShoppingBtn).toBeVisible();
		});
	});
});
