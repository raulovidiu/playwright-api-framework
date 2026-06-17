import { expect, test } from "@/fixtures/pom/test-options.js";

test.describe("Authentication - Form Validation", () => {
	test.beforeEach(async ({ loginPage }) => {
		await test.step("Navigare către pagina de autentificare", async () => {
			await loginPage.navigate();
		});
	});

	test("Shows error for invalid credentials", async ({ loginPage }) => {
		await test.step("Introducere credențiale invalide și trimitere formular", async () => {
			await loginPage.login("wrong@email.com", "wrongpassword");
		});

		await test.step("Validare afișare mesaj de eroare text", async () => {
			await expect(loginPage.errorMessage).toBeVisible();
			await expect(loginPage.errorMessage).toContainText("Invalid credentials");
		});
	});

	test("Shows validation for empty fields", async ({ loginPage }) => {
		await test.step("Trimitere formular fără completarea câmpurilor", async () => {
			await loginPage.submit();
		});

		await test.step("Validare declanșare eroare nativă HTML5 pe câmpul Email", async () => {
			const isInvalid = await loginPage.emailInput.evaluate(
				(el: any) => !el.checkValidity(),
			);
			expect(isInvalid).toBe(true);
		});
	});
});
