import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Homepage Product Search", () => {
	test.beforeEach(async ({ homePage }) => {
		await test.step("Navigare către pagina principală (Homepage)", async () => {
			await homePage.navigate();
		});
	});

	test("Displays all required fields on each product card", async ({
		homePage,
	}) => {
		const firstCard = homePage.firstProductCard;

		await test.step("Validare prezență elemente obligatorii pe primul card de produs", async () => {
			await expect(homePage.productCardName(firstCard)).toBeVisible();
			await expect(homePage.productCardPrice(firstCard)).toBeVisible();
			await expect(homePage.productCardStock(firstCard)).toBeVisible();
			await expect(homePage.productCardAddToCartBtn(firstCard)).toBeVisible();
		});
	});

	test("Displays the search bar", async ({ homePage }) => {
		await test.step("Validare vizibilitate câmp de căutare și buton aferent", async () => {
			await expect(homePage.searchInput).toBeVisible();
			await expect(homePage.searchBtn).toBeVisible();
		});
	});

	test("Filters products by name", async ({ homePage }) => {
		await test.step("Executare căutare după termenul 'Keyboard'", async () => {
			await homePage.searchFor("Keyboard");
		});

		await test.step("Validare filtrare corectă (un singur produs returnat)", async () => {
			await expect(homePage.productCards).toHaveCount(1);
		});
	});

	test("Filters products by category", async ({ homePage }) => {
		await test.step("Selectare filtru categorie 'electronics'", async () => {
			await homePage.filterByCategory("electronics");
		});

		await test.step("Validare număr produse returnate conform limitelor categoriei", async () => {
			const count = await homePage.productCards.count();
			expect(count).toBeGreaterThan(0);
			expect(count).toBeLessThan(9);
		});
	});
});
