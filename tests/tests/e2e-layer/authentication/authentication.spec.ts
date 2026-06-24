import { expect, test } from "@/fixtures/test-options.js";

test.describe("Authentication", () => {
	test.describe("Login", () => {
		test.beforeEach(async ({ loginPage }) => {
			await test.step("Navigate to login page", async () => {
				await loginPage.navigate();
			});
		});

		test("Displays login form", async ({ loginPage }) => {
			await test.step("Verify form heading and input visibility", async () => {
				await expect(loginPage.heading).toHaveText("Login to TechMart");
				await expect(loginPage.emailInput).toBeVisible();
				await expect(loginPage.passwordInput).toBeVisible();
				await expect(loginPage.submitBtn).toBeVisible();
			});
		});

		test("Logs in successfully with valid credentials", async ({
			loginPage,
			page,
		}) => {
			await test.step("Submit login form with valid credentials", async () => {
				await loginPage.login(
					process.env.USER_EMAIL!,
					process.env.USER_PASSWORD!,
				);
			});

			await test.step("Verify login success toast message appears", async () => {
				await expect(loginPage.toast).toContainText("Login successful");
			});

			await test.step("Verify redirection to home page", async () => {
				await page.waitForURL("/");
			});
		});

		test("Has link to registration page", async ({ loginPage, page }) => {
			await test.step("Verify sign-up link visibility", async () => {
				await expect(loginPage.signUpLink).toBeVisible();
			});

			await test.step("Click sign-up link and verify redirection to register page", async () => {
				await loginPage.goToRegister();
				await expect(page).toHaveURL("/register.html");
			});
		});

		test("Displays demo credentials", async ({ loginPage }) => {
			await test.step("Verify demo credentials area is visible and contains default data", async () => {
				await expect(loginPage.demoCredentials).toBeVisible();
				await expect(loginPage.demoCredentials).toContainText(
					process.env.USER_EMAIL!,
				);
				await expect(loginPage.demoCredentials).toContainText(
					process.env.USER_PASSWORD!,
				);
			});
		});
	});

	test.describe("Logout", () => {
		test("Logs out successfully", async ({ loginPage, page }) => {
			await test.step("Navigate to login page and perform sign in", async () => {
				await loginPage.navigate();
				await loginPage.login(
					process.env.USER_EMAIL!,
					process.env.USER_PASSWORD!,
				);
				await page.waitForURL("/");
			});

			await test.step("Verify user session header displays greeting", async () => {
				await expect(loginPage.authArea).toContainText("Hi, Demo User");
			});

			await test.step("Perform logout action", async () => {
				await loginPage.logout();
			});

			await test.step("Verify auth area reverts to login state", async () => {
				await expect(loginPage.authArea).toContainText("Login");
			});
		});
	});
});
