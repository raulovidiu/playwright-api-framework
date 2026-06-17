import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Homepage Rendition", () => {
	test.beforeEach(async ({ homePage }) => {
		await test.step("Navigare către pagina principală (Homepage)", async () => {
			await homePage.navigate();
		});
	});

	test("Renders the page title", async ({ page }) => {
		await test.step("Validare titlu pagină în browser tab", async () => {
			await expect(page).toHaveTitle(/Store/);
		});
	});

	test("Displays the logo in the navbar", async ({ homePage }) => {
		await test.step("Validare prezență și text Logo în bara de navigare", async () => {
			await expect(homePage.logo).toBeVisible();
			await expect(homePage.logo).toHaveText(/TechMart/);
		});
	});

	test("Shows zero cart count on initial load", async ({ homePage }) => {
		await test.step("Validare stare inițială coș de cumpărături (0 produse)", async () => {
			await expect(homePage.cartCount).toBeVisible();
			await expect(homePage.cartCount).toHaveText("0");
		});
	});

	test("Displays login and sign up buttons", async ({ homePage }) => {
		await test.step("Validare vizibilitate butoane de autentificare și înregistrare", async () => {
			await expect(homePage.loginBtn).toBeVisible();
			await expect(homePage.signUpBtn).toBeVisible();
		});
	});

	test("Renders the hero section with correct content", async ({
		homePage,
	}) => {
		await test.step("Validare texte secțiune principală (Hero Section)", async () => {
			await expect(homePage.heroTitle).toHaveText("Welcome to TechMart");
			await expect(homePage.heroSubtitle).toContainText(
				"best tech accessories",
			);
		});
	});

	test("Displays the full product grid", async ({ homePage }) => {
		await test.step("Validare încărcare grilă produse și număr elemente", async () => {
			await expect(homePage.productGrid).toBeVisible();
			await expect(homePage.productCards).toHaveCount(7);
		});
	});
});
