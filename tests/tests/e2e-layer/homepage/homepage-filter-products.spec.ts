import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Homepage Product Search", () => {
	test.beforeEach(async ({ homePage }) => {
		await homePage.navigate();
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
