import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Checkout UI and Form Validations", () => {
	test.beforeEach(async ({ clearCart, addProductToCart, checkoutPage }) => {
		await test.step("Prepare cart with an item via API and navigate to checkout", async () => {
			await clearCart();
			await addProductToCart(1, 1);
			await checkoutPage.navigate();
		});
	});

	test("Display checkout form sections", async ({ checkoutPage }) => {
		await test.step("Verify shipping and payment form visibility", async () => {
			await checkoutPage.expectShippingFormVisible();
			await checkoutPage.expectPaymentFormVisible();
		});
	});

	test("Calculate tax correctly based on product price", async ({
		checkoutPage,
	}) => {
		await test.step("Verify 8% tax calculation for the $79.99 product", async () => {
			// Product 1 is $79.99 -> Tax should be $6.40 (rounded)
			await expect(checkoutPage.tax).toContainText("6.40");
		});
	});

	test("Format card number with spaces automatically", async ({
		checkoutPage,
	}) => {
		await test.step("Type raw card number into the input field", async () => {
			await checkoutPage.cardNumber.fill("1234567890123456");
		});

		await test.step("Verify card number is formatted with spaces", async () => {
			await expect(checkoutPage.cardNumber).toHaveValue("1234 5678 9012 3456");
		});
	});

	test("Format expiry date correctly with a slash", async ({
		checkoutPage,
	}) => {
		await test.step("Type raw expiry date digits", async () => {
			await checkoutPage.expiry.fill("1225");
		});

		await test.step("Verify expiry date is formatted as MM/YY", async () => {
			await expect(checkoutPage.expiry).toHaveValue("12/25");
		});
	});

	test("Validate required fields on empty form submission", async ({
		checkoutPage,
	}) => {
		await test.step("Submit the form without filling any data", async () => {
			await checkoutPage.placeOrder();
		});

		await test.step("Verify browser HTML5 validation triggers for required fields", async () => {
			const isInvalid = await checkoutPage.firstName.evaluate(
				(el) => !(el as any).checkValidity(),
			);
			expect(isInvalid).toBe(true);
		});
	});

	test("Validate ZIP code format restrictions", async ({ checkoutPage }) => {
		await test.step("Fill shipping info with an invalid ZIP format", async () => {
			await checkoutPage.fillShippingInfo({
				firstName: "John",
				lastName: "Doe",
				address: "123 Main Street",
				city: "Grand Rapids",
				state: "MI",
				zip: "abc", // Invalid ZIP
				phone: "555-123-4567",
			});
		});

		await test.step("Submit the order form", async () => {
			await checkoutPage.placeOrder();
		});

		await test.step("Verify ZIP code field triggers validation error", async () => {
			const isInvalid = await checkoutPage.zip.evaluate(
				(el) => !(el as any).checkValidity(),
			);
			expect(isInvalid).toBe(true);
		});
	});
});
