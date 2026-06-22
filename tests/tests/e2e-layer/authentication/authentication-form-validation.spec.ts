import { expect, test } from "@/fixtures/test-options.js";

test.describe("Authentication - Form Validation", () => {
	test.beforeEach(async ({ loginPage }) => {
		await test.step("Navigate to the login page", async () => {
			await loginPage.navigate();
		});
	});

	test("Shows error for invalid credentials", async ({ loginPage }) => {
		await test.step("Enter invalid credentials and submit the form", async () => {
			await loginPage.login("wrong@email.com", "wrongpassword");
		});

		await test.step("Validate that the error message text is displayed", async () => {
			await expect(loginPage.errorMessage).toBeVisible();
			await expect(loginPage.errorMessage).toContainText("Invalid credentials");
		});
	});

	test("Shows validation for empty fields", async ({ loginPage }) => {
		await test.step("Submit the form without filling in any fields", async () => {
			await loginPage.submit();
		});

		await test.step("Validate that the native HTML5 error is triggered on the Email field", async () => {
			const isInvalid = await loginPage.emailInput.evaluate(
				(el: any) => !el.checkValidity(),
			);
			expect(isInvalid).toBe(true);
		});
	});
});
