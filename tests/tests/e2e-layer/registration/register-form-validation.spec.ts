import { expect, test } from "@/fixtures/test-options.js";

test.describe("Registration", () => {
	test.describe("Form Validation and Navigation", () => {
		test.beforeEach(async ({ registerPage }) => {
			await test.step("Navigate to registration page", async () => {
				await registerPage.navigate();
			});
		});

		test("Displays registration form", async ({ registerPage }) => {
			await test.step("Verify form heading and inputs are visible", async () => {
				await expect(registerPage.heading).toHaveText("Create Your Account");
				await expect(registerPage.nameInput).toBeVisible();
				await expect(registerPage.emailInput).toBeVisible();
				await expect(registerPage.passwordInput).toBeVisible();
				await expect(registerPage.confirmPasswordInput).toBeVisible();
			});
		});

		test("Shows error for mismatched passwords", async ({ registerPage }) => {
			await test.step("Submit form with mismatching passwords", async () => {
				await registerPage.register(
					"Test User",
					"test@example.com",
					"password123",
					"different123",
				);
			});

			await test.step("Verify error message is displayed with correct text", async () => {
				await expect(registerPage.errorMessage).toBeVisible();
				await expect(registerPage.errorMessage).toContainText(
					"Passwords do not match",
				);
			});
		});

		test("Has link to login page", async ({ registerPage, page }) => {
			await test.step("Verify login link visibility", async () => {
				await expect(registerPage.loginLink).toBeVisible();
			});

			await test.step("Click login link and verify redirection to login page", async () => {
				await registerPage.goToLogin();
				await expect(page).toHaveURL("/login.html");
			});
		});
	});
});
