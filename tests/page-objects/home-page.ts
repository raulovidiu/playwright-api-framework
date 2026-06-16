import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the Homepage.
 * Encapsulates all selectors and reusable interactions for the landing page.
 * @export
 * @class HomePage
 */
export class HomePage {
	constructor(private page: Page) { }

	// Navbar area

	get logo(): Locator {
		return this.page.locator(".logo");
	}

	get cartCount(): Locator {
		return this.page.locator("#cartCount");
	}

	get loginBtn(): Locator {
		return this.page.locator("#authArea").getByText("Login");
	}

	get signUpBtn(): Locator {
		return this.page.locator("#authArea").getByText("Sign Up");
	}

	get authArea(): Locator {
		return this.page.locator("#authArea");
	}

	// Search area

	get searchInput(): Locator {
		return this.page.locator("#searchInput");
	}

	get searchBtn(): Locator {
		return this.page.locator("#searchBtn");
	}

	// Hero Section

	get heroTitle(): Locator {
		return this.page.locator(".hero h1");
	}

	get heroSubtitle(): Locator {
		return this.page.locator(".hero p");
	}

	// Filters

	get categoryFilter(): Locator {
		return this.page.locator("#categoryFilter");
	}

	// Product Grid area

	get productGrid(): Locator {
		return this.page.locator("#productGrid");
	}

	get productCards(): Locator {
		return this.page.locator(".product-card");
	}

	get firstProductCard(): Locator {
		return this.productCards.first();
	}

	productCardName(card: Locator): Locator {
		return card.locator(".product-info h3");
	}

	productCardPrice(card: Locator): Locator {
		return card.locator(".product-price");
	}

	productCardStock(card: Locator): Locator {
		return card.locator(".product-stock");
	}

	productCardAddToCartBtn(card: Locator): Locator {
		return card.locator(".add-to-cart-btn");
	}

	// Actions

	/**
	 * Navigates to the homepage and waits for the hero title to be visible.
	 */
	async navigate(): Promise<void> {
		await this.page.goto("/");
		await expect(this.heroTitle).toBeVisible();
	}

	/**
	 * Types a query into the search bar and submits it.
	 * @param query - The search term to enter.
	 */
	async searchFor(query: string): Promise<void> {
		await this.searchInput.fill(query);
		await this.searchBtn.click();
	}

	/**
	 * Selects a category from the category filter dropdown.
	 * @param category - The option value to select (e.g. "electronics").
	 */
	async filterByCategory(category: string): Promise<void> {
		await this.categoryFilter.selectOption(category);
	}
}
