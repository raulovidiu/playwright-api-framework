import { expect, test } from "@/fixtures/test-options.js";

test.describe("Homepage Rendition", () => {
	test.beforeEach(async ({ homePage }) => {
		await test.step("Navigate to the homepage", async () => {
			await homePage.navigate();
		});
	});

	test("Renders the page title", async ({ page }) => {
		await test.step("Validate page title in browser tab", async () => {
			await expect(page).toHaveTitle(/Store/);
		});
	});

	test("Displays the logo in the navbar", async ({ homePage }) => {
		await test.step("Validate presence and text of the Logo in the navigation bar", async () => {
			await expect(homePage.logo).toBeVisible();
			await expect(homePage.logo).toHaveText(/TechMart/);
		});
	});

	test("Shows zero cart count on initial load", async ({ homePage }) => {
		await test.step("Validate initial shopping cart state (0 items)", async () => {
			await expect(homePage.cartCount).toBeVisible();
			await expect(homePage.cartCount).toHaveText("0");
		});
	});

	test("Displays login and sign up buttons", async ({ homePage }) => {
		await test.step("Validate visibility of authentication and registration buttons", async () => {
			await expect(homePage.loginBtn).toBeVisible();
			await expect(homePage.signUpBtn).toBeVisible();
		});
	});

	test("Renders the hero section with correct content", async ({
		homePage,
	}) => {
		await test.step("Validate texts in the main hero section", async () => {
			await expect(homePage.heroTitle).toHaveText("Welcome to TechMart");
			await expect(homePage.heroSubtitle).toContainText(
				"best tech accessories",
			);
		});
	});

	test("Displays the full product grid", async ({ homePage }) => {
		await test.step("Validate product grid loading and element count", async () => {
			await expect(homePage.productGrid).toBeVisible();
			await expect(homePage.productCards).toHaveCount(7);
		});
	});
});
