import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Homepage", () => {
	test.beforeEach(async ({ homePage }) => {
		await homePage.navigate();
	});

	test("Renders the page title", async ({ page }) => {
		await expect(page).toHaveTitle(/Store/);
	});

	test("Displays the logo in the navbar", async ({ homePage }) => {
		await expect(homePage.logo).toBeVisible();
		await expect(homePage.logo).toHaveText(/TechMart/);
	});

	test("Shows zero cart count on initial load", async ({ homePage }) => {
		await expect(homePage.cartCount).toBeVisible();
		await expect(homePage.cartCount).toHaveText("0");
	});

	test("Displays login and sign up buttons", async ({ homePage }) => {
		await expect(homePage.loginBtn).toBeVisible();
		await expect(homePage.signUpBtn).toBeVisible();
	});

	test("Renders the hero section with correct content", async ({
		homePage,
	}) => {
		await expect(homePage.heroTitle).toHaveText("Welcome to TechMart");
		await expect(homePage.heroSubtitle).toContainText("best tech accessories");
	});

	test("Displays the full product grid", async ({ homePage }) => {
		await expect(homePage.productGrid).toBeVisible();
		await expect(homePage.productCards).toHaveCount(7);
	});

	test("Displays all required fields on each product card", async ({
		homePage,
	}) => {
		const firstCard = homePage.firstProductCard;

		await expect(homePage.productCardName(firstCard)).toBeVisible();
		await expect(homePage.productCardPrice(firstCard)).toBeVisible();
		await expect(homePage.productCardStock(firstCard)).toBeVisible();
		await expect(homePage.productCardAddToCartBtn(firstCard)).toBeVisible();
	});

	test("Displays the search bar", async ({ homePage }) => {
		await expect(homePage.searchInput).toBeVisible();
		await expect(homePage.searchBtn).toBeVisible();
	});

	test("Filters products by name", async ({ homePage }) => {
		await homePage.searchFor("Keyboard");

		await expect(homePage.productCards).toHaveCount(1);
	});

	test("Filters products by category", async ({ homePage }) => {
		await homePage.filterByCategory("electronics");

		const count = await homePage.productCards.count();
		expect(count).toBeGreaterThan(0);
		expect(count).toBeLessThan(9);
	});
});
