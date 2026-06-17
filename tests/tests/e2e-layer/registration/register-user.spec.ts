import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Registration", () => {
	test.describe("Register New User - Nominal Conditions", () => {
		test.beforeEach(async ({ registerPage }) => {
			await registerPage.navigate();
		});

		test("Registers new user successfully", async ({ registerPage, page }) => {
			const uniqueEmail = `test${Date.now()}@example.com`;

			await registerPage.register("New User", uniqueEmail, "password123");

			await expect(registerPage.toast).toContainText("Account created");
			await page.waitForURL("/");
		});
	});

	test.describe("Form Validation and Navigation", () => {
		test.beforeEach(async ({ registerPage }) => {
			await registerPage.navigate();
		});

		test("Displays registration form", async ({ registerPage }) => {
			await expect(registerPage.heading).toHaveText("Create Your Account");
			await expect(registerPage.nameInput).toBeVisible();
			await expect(registerPage.emailInput).toBeVisible();
			await expect(registerPage.passwordInput).toBeVisible();
			await expect(registerPage.confirmPasswordInput).toBeVisible();
		});

		test("Shows error for mismatched passwords", async ({ registerPage }) => {
			await registerPage.register(
				"Test User",
				"test@example.com",
				"password123",
				"different123",
			);

			await expect(registerPage.errorMessage).toBeVisible();
			await expect(registerPage.errorMessage).toContainText(
				"Passwords do not match",
			);
		});

		test("Has link to login page", async ({ registerPage, page }) => {
			await expect(registerPage.loginLink).toBeVisible();

			await registerPage.goToLogin();
			await expect(page).toHaveURL("/login.html");
		});
	});
});
