import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Homepage Product Search", () => {
	test.beforeEach(async ({ homePage }) => {
		await test.step("Navigate to the homepage", async () => {
			await homePage.navigate();
		});
	});

	test("Displays all required fields on each product card", async ({
		homePage,
	}) => {
		const firstCard = homePage.firstProductCard;

		await test.step("Validate presence of required elements on the first product card", async () => {
			await expect(homePage.productCardName(firstCard)).toBeVisible();
			await expect(homePage.productCardPrice(firstCard)).toBeVisible();
			await expect(homePage.productCardStock(firstCard)).toBeVisible();
			await expect(homePage.productCardAddToCartBtn(firstCard)).toBeVisible();
		});
	});

	test("Displays the search bar", async ({ homePage }) => {
		await test.step("Validate visibility of the search input and its corresponding button", async () => {
			await expect(homePage.searchInput).toBeVisible();
			await expect(homePage.searchBtn).toBeVisible();
		});
	});

	test("Filters products by name", async ({ homePage }) => {
		await test.step("Execute search for the term 'Keyboard'", async () => {
			await homePage.searchFor("Keyboard");
		});

		await test.step("Validate correct filtering (exactly one product returned)", async () => {
			await expect(homePage.productCards).toHaveCount(1);
		});
	});

	test("Filters products by category", async ({ homePage }) => {
		await test.step("Select the 'electronics' category filter", async () => {
			await homePage.filterByCategory("electronics");
		});

		await test.step("Validate that the number of returned products is within category limits", async () => {
			const count = await homePage.productCards.count();
			expect(count).toBeGreaterThan(0);
			expect(count).toBeLessThan(9);
		});
	});
});
