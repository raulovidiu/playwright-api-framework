import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the Registration page.
 * Encapsulates all selectors and reusable interactions for /register.html.
 * @export
 * @class RegisterPage
 */
export class RegisterPage {
	constructor(private page: Page) { }

	// Form

	get heading(): Locator {
		return this.page.locator("h1");
	}

	get nameInput(): Locator {
		return this.page.locator("#name");
	}

	get emailInput(): Locator {
		return this.page.locator("#email");
	}

	get passwordInput(): Locator {
		return this.page.locator("#password");
	}

	get confirmPasswordInput(): Locator {
		return this.page.locator("#confirmPassword");
	}

	get submitBtn(): Locator {
		return this.page.locator('button[type="submit"]');
	}

	get errorMessage(): Locator {
		return this.page.locator("#errorMessage");
	}

	get toast(): Locator {
		return this.page.locator("#toast");
	}

	// Links

	get loginLink(): Locator {
		return this.page.getByText("Login here");
	}

	// Actions

	/**
	 * Navigates to the registration page and waits for the heading to be visible.
	 */
	async navigate(): Promise<void> {
		await this.page.goto("/register.html");
		await expect(this.heading).toBeVisible();
	}

	/**
	 * Fills in the full registration form.
	 * @param name - Full name of the user.
	 * @param email - Email address.
	 * @param password - Password.
	 * @param confirmPassword - Password confirmation. Defaults to `password` if omitted.
	 */
	async fillForm(
		name: string,
		email: string,
		password: string,
		confirmPassword: string = password,
	): Promise<void> {
		await this.nameInput.fill(name);
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.confirmPasswordInput.fill(confirmPassword);
	}

	/**
	 * Submits the registration form.
	 */
	async submit(): Promise<void> {
		await this.submitBtn.click();
	}

	/**
	 * Fills the form and submits it in one step.
	 * @param name - Full name of the user.
	 * @param email - Email address.
	 * @param password - Password.
	 * @param confirmPassword - Password confirmation. Defaults to `password` if omitted.
	 */
	async register(
		name: string,
		email: string,
		password: string,
		confirmPassword: string = password,
	): Promise<void> {
		await this.fillForm(name, email, password, confirmPassword);
		await this.submit();
	}

	/**
	 * Clicks the "Login here" link to navigate to the login page.
	 */
	async goToLogin(): Promise<void> {
		await this.loginLink.click();
	}
}
