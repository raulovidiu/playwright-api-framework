import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the Checkout page.
 * Encapsulates all selectors and reusable interactions for /checkout.html.
 * @export
 * @class CheckoutPage
 */
export class CheckoutPage {
	constructor(private page: Page) { }

	// Shipping information fields

	get firstName(): Locator {
		return this.page.locator("#firstName");
	}

	get lastName(): Locator {
		return this.page.locator("#lastName");
	}

	get address(): Locator {
		return this.page.locator("#address");
	}

	get address2(): Locator {
		return this.page.locator("#address2");
	}

	get city(): Locator {
		return this.page.locator("#city");
	}

	get state(): Locator {
		return this.page.locator("#state");
	}

	get zip(): Locator {
		return this.page.locator("#zip");
	}

	get phone(): Locator {
		return this.page.locator("#phone");
	}

	// Payment information fields

	get cardName(): Locator {
		return this.page.locator("#cardName");
	}

	get cardNumber(): Locator {
		return this.page.locator("#cardNumber");
	}

	get expiry(): Locator {
		return this.page.locator("#expiry");
	}

	get cvv(): Locator {
		return this.page.locator("#cvv");
	}

	// Order summary

	get orderSummary(): Locator {
		return this.page.locator(".order-summary-sidebar");
	}

	get orderItems(): Locator {
		return this.orderSummary.locator(".order-item");
	}

	get subtotal(): Locator {
		return this.page.locator("#subtotal");
	}

	get tax(): Locator {
		return this.page.locator("#tax");
	}

	get total(): Locator {
		return this.page.locator("#total");
	}

	// Actions / confirmation

	get placeOrderBtn(): Locator {
		return this.page.locator("#placeOrderBtn");
	}

	get orderConfirmation(): Locator {
		return this.page.locator("#orderConfirmation");
	}

	get orderId(): Locator {
		return this.page.locator("#orderId");
	}

	get backToCartBtn(): Locator {
		return this.page.getByRole("link", { name: "Back to Cart" });
	}

	// Actions

	/**
	 * Navigates to the checkout page.
	 * Note: does not assert visibility, since checkout redirects to /cart.html
	 * when the cart is empty.
	 */
	async navigate(): Promise<void> {
		await this.page.goto("/checkout.html");
	}

	/**
	 * Fills out the shipping information section of the form.
	 * @param shipping - Shipping details to fill in.
	 */
	async fillShippingInfo(shipping: {
		firstName: string;
		lastName: string;
		address: string;
		address2?: string;
		city: string;
		state: string;
		zip: string;
		phone: string;
	}): Promise<void> {
		await this.firstName.fill(shipping.firstName);
		await this.lastName.fill(shipping.lastName);
		await this.address.fill(shipping.address);
		if (shipping.address2) {
			await this.address2.fill(shipping.address2);
		}
		await this.city.fill(shipping.city);
		await this.state.selectOption(shipping.state);
		await this.zip.fill(shipping.zip);
		await this.phone.fill(shipping.phone);
	}

	/**
	 * Fills out the payment information section of the form.
	 * @param payment - Payment details to fill in.
	 */
	async fillPaymentInfo(payment: {
		cardName: string;
		cardNumber: string;
		expiry: string;
		cvv: string;
	}): Promise<void> {
		await this.cardName.fill(payment.cardName);
		await this.cardNumber.fill(payment.cardNumber);
		await this.expiry.fill(payment.expiry);
		await this.cvv.fill(payment.cvv);
	}

	/**
	 * Clicks the "Place Order" button to submit the checkout form.
	 */
	async placeOrder(): Promise<void> {
		await this.placeOrderBtn.click();
	}

	/**
	 * Convenience helper that fills both shipping and payment sections
	 * and submits the order in one call.
	 * @param shipping - Shipping details to fill in.
	 * @param payment - Payment details to fill in.
	 */
	async completeCheckout(
		shipping: {
			firstName: string;
			lastName: string;
			address: string;
			address2?: string;
			city: string;
			state: string;
			zip: string;
			phone: string;
		},
		payment: {
			cardName: string;
			cardNumber: string;
			expiry: string;
			cvv: string;
		},
	): Promise<void> {
		await this.fillShippingInfo(shipping);
		await this.fillPaymentInfo(payment);
		await this.placeOrder();
	}

	// Assertions

	/**
	 * Asserts that the shipping form fields are visible.
	 */
	async expectShippingFormVisible(): Promise<void> {
		await expect(this.firstName).toBeVisible();
		await expect(this.lastName).toBeVisible();
		await expect(this.address).toBeVisible();
		await expect(this.city).toBeVisible();
		await expect(this.state).toBeVisible();
		await expect(this.zip).toBeVisible();
		await expect(this.phone).toBeVisible();
	}

	/**
	 * Asserts that the payment form fields are visible.
	 */
	async expectPaymentFormVisible(): Promise<void> {
		await expect(this.cardName).toBeVisible();
		await expect(this.cardNumber).toBeVisible();
		await expect(this.expiry).toBeVisible();
		await expect(this.cvv).toBeVisible();
	}
}
