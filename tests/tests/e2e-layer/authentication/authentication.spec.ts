import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Authentication", () => {
	test.describe("Login", () => {
		test.beforeEach(async ({ loginPage }) => {
			await loginPage.navigate();
		});

		test("Displays login form", async ({ loginPage }) => {
			await expect(loginPage.heading).toHaveText("Login to TechMart");
			await expect(loginPage.emailInput).toBeVisible();
			await expect(loginPage.passwordInput).toBeVisible();
			await expect(loginPage.submitBtn).toBeVisible();
		});

		test("Logs in successfully with valid credentials", async ({
			loginPage,
			page,
		}) => {
			await loginPage.login("demo@techmart.com", "demo123");

			await expect(loginPage.toast).toContainText("Login successful");
			await page.waitForURL("/");
		});

		test("Has link to registration page", async ({
			loginPage,
			page,
		}) => {
			await expect(loginPage.signUpLink).toBeVisible();

			await loginPage.goToRegister();
			await expect(page).toHaveURL("/register.html");
		});

		test("Displays demo credentials", async ({ loginPage }) => {
			await expect(loginPage.demoCredentials).toBeVisible();
			await expect(loginPage.demoCredentials).toContainText("demo@techmart.com");
			await expect(loginPage.demoCredentials).toContainText("demo123");
		});
	});

	test.describe("Logout", () => {
		test("Logs out successfully", async ({ loginPage, page }) => {
			await loginPage.navigate();
			await loginPage.login("demo@techmart.com", "demo123");
			await page.waitForURL("/");

			await expect(loginPage.authArea).toContainText("Hi, Demo User");

			await loginPage.logout();

			await expect(loginPage.authArea).toContainText("Login");
		});
	});
});
