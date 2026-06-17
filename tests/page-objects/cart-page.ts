import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the Shopping Cart page and cart-related interactions on other pages.
 * Encapsulates all selectors and reusable interactions for /cart.html.
 * @export
 * @class CartPage
 */
export class CartPage {
	constructor(private page: Page) { }

	// Cart page elements

	get heading(): Locator {
		return this.page.locator("h1");
	}

	get cartItems(): Locator {
		return this.page.locator(".cart-item");
	}

	get qtyValues(): Locator {
		return this.page.locator(".qty-value");
	}

	get removeBtn(): Locator {
		return this.page.locator(".remove-btn");
	}

	get clearCartBtn(): Locator {
		return this.page.getByRole('button', { name: 'Clear Cart' });
	}

	get total(): Locator {
		return this.page.locator("#total");
	}

	get emptyCart(): Locator {
		return this.page.locator("#emptyCart");
	}

	get startShoppingBtn(): Locator {
		return this.emptyCart.getByText("Start Shopping");
	}

	get toast(): Locator {
		return this.page.locator("#toast");
	}

	get decreaseQtyBtn(): Locator {
		return this.page.locator(".qty-btn").nth(0);
	}

	get increaseQtyBtn(): Locator {
		return this.page.locator(".qty-btn").nth(1);
	}

	// Elements on other pages (e.g. product listing) used to get items into the cart

	get addToCartBtn(): Locator {
		return this.page.locator(".add-to-cart-btn");
	}

	get cartCount(): Locator {
		return this.page.locator("#cartCount");
	}

	get cartLink(): Locator {
		return this.page.locator(".cart-link");
	}

	// Actions

	/**
	 * Navigates to the cart page and waits for the heading to be visible.
	 */
	async navigate(): Promise<void> {
		await this.page.goto("/cart.html");
		await expect(this.heading).toBeVisible();
	}

	/**
	 * Clicks the first "Add to cart" button on the current page (e.g. product listing).
	 */
	async addFirstItemToCart(): Promise<void> {
		await this.addToCartBtn.first().click();
	}

	/**
	 * Clicks the cart link to navigate to the cart page.
	 */
	async goToCart(): Promise<void> {
		await this.cartLink.first().click();
	}

	/**
	 * Increases the quantity of the (first) cart item by clicking the increase button.
	 */
	async increaseQuantity(): Promise<void> {
		await this.increaseQtyBtn.click();
	}

	/**
	 * Decreases the quantity of the (first) cart item by clicking the decrease button.
	 */
	async decreaseQuantity(): Promise<void> {
		await this.decreaseQtyBtn.click();
	}

	/**
	 * Removes the (first) item from the cart.
	 */
	async removeFirstItem(): Promise<void> {
		await this.removeBtn.first().click();
	}

	/**
	 * Clears the entire cart via the "Clear Cart" button.
	 */
	async clearCart(): Promise<void> {
		await this.clearCartBtn.click();
	}

	/**
	 * Adds an item to the cart directly via the API, bypassing the UI.
	 * Useful for arranging test state without coupling tests to UI flows.
	 * @param productId - ID of the product to add.
	 * @param quantity - Quantity to add. Defaults to 1.
	 */
	async addItemViaApi(productId: number, quantity: number = 1): Promise<void> {
		await this.page.request.post("http://localhost:3000/api/cart", {
			data: { productId, quantity },
		});
	}

}
