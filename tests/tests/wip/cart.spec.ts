import { expect, test } from "@playwright/test";

/**
 * Shopping Cart Tests
 * Tests for cart functionality including add, update, and remove items
 */

test.describe("Shopping Cart", () => {
	test.beforeEach(async ({ page }) => {
		// Clear cart before each test via API
		await page.request.delete("http://localhost:3000/api/cart");
		await page.goto("/");
	});

	test("should add item to cart", async ({ page }) => {
		// Click add to cart on first product
		const addButton = page.locator(".add-to-cart-btn").first();
		await addButton.click();

		// Verify toast message appears
		const toast = page.locator("#toast");
		await expect(toast).toContainText("Added to cart");

		// Verify cart count updates
		const cartCount = page.locator("#cartCount").first();
		await expect(cartCount).toHaveText("1");
	});

	test("should navigate to cart page", async ({ page }) => {
		// Add item first
		await page.locator(".add-to-cart-btn").first().click();

		// Click on cart link
		await page.locator(".cart-link").first().click();

		// Verify we're on cart page
		await expect(page).toHaveURL("/cart.html");
		await expect(page.locator("h1")).toHaveText("Your Shopping Cart");
	});

	test("should display cart items correctly", async ({ page }) => {
		// Add item via API for consistency
		await page.request.post("http://localhost:3000/api/cart", {
			data: { productId: 1, quantity: 2 },
		});

		// Navigate to cart
		await page.goto("/cart.html");

		// Verify cart item is displayed
		const cartItem = page.locator(".cart-item");
		await expect(cartItem).toHaveCount(1);

		// Verify quantity is correct
		const qtyValue = page.locator(".qty-value");
		await expect(qtyValue).toHaveText("2");
	});

	test("should update item quantity", async ({ page }) => {
		// Add item first
		await page.request.post("http://localhost:3000/api/cart", {
			data: { productId: 1, quantity: 1 },
		});

		await page.goto("/cart.html");

		// Click increase quantity button
		const increaseBtn = page.locator(".qty-btn").nth(1); // Second button is +
		await increaseBtn.click();

		// Verify quantity increased
		const qtyValue = page.locator(".qty-value");
		await expect(qtyValue).toHaveText("2");
	});

	test("should remove item from cart", async ({ page }) => {
		// Add item first
		await page.request.post("http://localhost:3000/api/cart", {
			data: { productId: 1, quantity: 1 },
		});

		await page.goto("/cart.html");

		// Click remove button
		const removeBtn = page.locator(".remove-btn");
		await removeBtn.click();

		// Verify empty cart message appears
		const emptyCart = page.locator("#emptyCart");
		await expect(emptyCart).toBeVisible();
	});

	test("should clear entire cart", async ({ page }) => {
		// Add multiple items
		await page.request.post("http://localhost:3000/api/cart", {
			data: { productId: 1, quantity: 1 },
		});
		await page.request.post("http://localhost:3000/api/cart", {
			data: { productId: 2, quantity: 1 },
		});

		await page.goto("/cart.html");

		// Click clear cart button
		const clearBtn = page.locator("#clearCartBtn");
		await clearBtn.click();

		// Verify cart is empty
		const emptyCart = page.locator("#emptyCart");
		await expect(emptyCart).toBeVisible();
	});

	test("should calculate correct totals", async ({ page }) => {
		// Add item with known price ($79.99 for product 1)
		await page.request.post("http://localhost:3000/api/cart", {
			data: { productId: 1, quantity: 2 },
		});

		await page.goto("/cart.html");

		// Verify total (2 × $79.99 = $159.98)
		const total = page.locator("#total");
		await expect(total).toContainText("159.98");
	});

	test("should show empty cart message when cart is empty", async ({
		page,
	}) => {
		await page.goto("/cart.html");

		// Verify empty cart elements are visible
		const emptyCart = page.locator("#emptyCart");
		await expect(emptyCart).toBeVisible();
		await expect(emptyCart).toContainText("Your cart is empty");

		// Verify "Start Shopping" button exists
		const startShoppingBtn = emptyCart.locator("text=Start Shopping");
		await expect(startShoppingBtn).toBeVisible();
	});
});
