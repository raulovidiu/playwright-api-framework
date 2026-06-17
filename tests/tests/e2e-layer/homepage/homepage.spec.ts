import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Homepage Rendition", () => {
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
});
