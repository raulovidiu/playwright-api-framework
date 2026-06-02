import { expect, test } from "@playwright/test";

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart and add an item before each test
    await page.request.delete("http://localhost:3000/api/cart");
    await page.request.post("http://localhost:3000/api/cart", {
      data: { productId: 1, quantity: 1 },
    });
  });

  test("should redirect to cart if cart is empty", async ({ page }) => {
    // Clear cart
    await page.request.delete("http://localhost:3000/api/cart");

    // Try to access checkout
    await page.goto("/checkout.html");

    // Should redirect to cart
    await page.waitForURL("/cart.html");
  });

  test("should display checkout form", async ({ page }) => {
    await page.goto("/checkout.html");

    // Verify shipping form fields
    await expect(page.locator("#firstName")).toBeVisible();
    await expect(page.locator("#lastName")).toBeVisible();
    await expect(page.locator("#address")).toBeVisible();
    await expect(page.locator("#city")).toBeVisible();
    await expect(page.locator("#state")).toBeVisible();
    await expect(page.locator("#zip")).toBeVisible();
    await expect(page.locator("#phone")).toBeVisible();

    // Verify payment form fields
    await expect(page.locator("#cardName")).toBeVisible();
    await expect(page.locator("#cardNumber")).toBeVisible();
    await expect(page.locator("#expiry")).toBeVisible();
    await expect(page.locator("#cvv")).toBeVisible();
  });

  test("should display order summary", async ({ page }) => {
    await page.goto("/checkout.html");

    // Verify order summary section
    const orderSummary = page.locator(".order-summary-sidebar");
    await expect(orderSummary).toBeVisible();

    // Verify item is listed
    await expect(orderSummary.locator(".order-item")).toHaveCount(1);

    // Verify totals are displayed
    await expect(page.locator("#subtotal")).toBeVisible();
    await expect(page.locator("#tax")).toBeVisible();
    await expect(page.locator("#total")).toBeVisible();
  });

  test("should calculate tax correctly", async ({ page }) => {
    await page.goto("/checkout.html");

    // Product 1 is $79.99
    // Tax is 8%
    // Tax should be $6.40 (rounded)
    const tax = page.locator("#tax");
    await expect(tax).toContainText("6.40");
  });

  test("should format card number with spaces", async ({ page }) => {
    await page.goto("/checkout.html");

    const cardNumber = page.locator("#cardNumber");
    await cardNumber.fill("1234567890123456");

    // Should be formatted as 1234 5678 9012 3456
    await expect(cardNumber).toHaveValue("1234 5678 9012 3456");
  });

  test("should format expiry date correctly", async ({ page }) => {
    await page.goto("/checkout.html");

    const expiry = page.locator("#expiry");
    await expiry.fill("1225");

    // Should be formatted as 12/25
    await expect(expiry).toHaveValue("12/25");
  });

  test("should complete checkout successfully", async ({ page }) => {
    await page.goto("/checkout.html");

    // Fill shipping information
    await page.locator("#firstName").fill("John");
    await page.locator("#lastName").fill("Doe");
    await page.locator("#address").fill("123 Main Street");
    await page.locator("#city").fill("Grand Rapids");
    await page.locator("#state").selectOption("MI");
    await page.locator("#zip").fill("49501");
    await page.locator("#phone").fill("555-123-4567");

    // Fill payment information
    await page.locator("#cardName").fill("John Doe");
    await page.locator("#cardNumber").fill("4111111111111111");
    await page.locator("#expiry").fill("12/25");
    await page.locator("#cvv").fill("123");

    // Submit order
    await page.locator("#placeOrderBtn").click();

    // Verify order confirmation modal
    const confirmationModal = page.locator("#orderConfirmation");
    await expect(confirmationModal).toBeVisible();
    await expect(confirmationModal).toContainText("Order Confirmed");
    await expect(page.locator("#orderId")).not.toBeEmpty();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/checkout.html");

    // Try to submit empty form
    await page.locator("#placeOrderBtn").click();

    // First name should show validation
    const firstName = page.locator("#firstName");
    const isInvalid = await firstName.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test("should validate ZIP code format", async ({ page }) => {
    await page.goto("/checkout.html");

    // Fill all fields but with invalid ZIP
    await page.locator("#firstName").fill("John");
    await page.locator("#lastName").fill("Doe");
    await page.locator("#address").fill("123 Main Street");
    await page.locator("#city").fill("Grand Rapids");
    await page.locator("#state").selectOption("MI");
    await page.locator("#zip").fill("abc"); // Invalid ZIP
    await page.locator("#phone").fill("555-123-4567");

    await page.locator("#placeOrderBtn").click();

    // ZIP should show validation error
    const zip = page.locator("#zip");
    const isInvalid = await zip.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });
});
