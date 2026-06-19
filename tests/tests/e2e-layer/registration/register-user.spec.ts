import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Registration", () => {
	test.describe("Register User - Nominal Conditions", () => {
		test.beforeEach(async ({ registerPage }) => {
			await test.step("Navigate to registration page", async () => {
				await registerPage.navigate();
			});
		});

		test("Registers new user successfully", async ({ registerPage, page }) => {
			const uniqueEmail = `test${Date.now()}@example.com`;

			await test.step("Submit registration form with unique email", async () => {
				await registerPage.register("New User", uniqueEmail, "password123");
			});

			await test.step("Verify account creation toast message appears", async () => {
				await expect(registerPage.toast).toContainText("Account created");
			});

			await test.step("Verify redirection to home page", async () => {
				await page.waitForURL("/");
			});
		});
	});
});
