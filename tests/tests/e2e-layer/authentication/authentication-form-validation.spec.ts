import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Authentication - Form Validation", () => {
	test.beforeEach(async ({ loginPage }) => {
		await loginPage.navigate();
	});

	test("Shows error for invalid credentials", async ({
		loginPage,
	}) => {
		await loginPage.login("wrong@email.com", "wrongpassword");

		await expect(loginPage.errorMessage).toBeVisible();
		await expect(loginPage.errorMessage).toContainText("Invalid credentials");
	});

	test("Shows validation for empty fields", async ({
		loginPage,
	}) => {
		await loginPage.submit();

		const isInvalid = await loginPage.emailInput.evaluate(
			(el: any) => !el.checkValidity(),
		);
		expect(isInvalid).toBe(true);
	});
});
