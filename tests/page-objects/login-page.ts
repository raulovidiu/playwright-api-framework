import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the Login page.
 * Encapsulates all selectors and reusable interactions for /login.html.
 * @export
 * @class LoginPage
 */
export class LoginPage {
	constructor(private page: Page) { }

	// Form

	get heading(): Locator {
		return this.page.locator("h1");
	}

	get emailInput(): Locator {
		return this.page.locator("#email");
	}

	get passwordInput(): Locator {
		return this.page.locator("#password");
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

	get signUpLink(): Locator {
		return this.page.getByText("Sign up here");
	}

	// Demo credentials section

	get demoCredentials(): Locator {
		return this.page.locator(".demo-credentials");
	}

	// Post-login navbar (shared shell, kept here for logout flow convenience)

	get authArea(): Locator {
		return this.page.locator("#authArea");
	}

	get logoutBtn(): Locator {
		return this.page.locator("#logoutBtn");
	}

	// Actions

	/**
	 * Navigates to the login page and waits for the heading to be visible.
	 */
	async navigate(): Promise<void> {
		await this.page.goto("/login.html");
		await expect(this.heading).toBeVisible();
	}

	/**
	 * Fills in the email and password fields.
	 * @param email - The email to enter.
	 * @param password - The password to enter.
	 */
	async fillCredentials(email: string, password: string): Promise<void> {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
	}

	/**
	 * Submits the login form.
	 */
	async submit(): Promise<void> {
		await this.submitBtn.click();
	}

	/**
	 * Fills credentials and submits the form in one step.
	 * @param email - The email to enter.
	 * @param password - The password to enter.
	 */
	async login(email: string, password: string): Promise<void> {
		await this.fillCredentials(email, password);
		await this.submit();
	}

	/**
	 * Clicks the "Sign up here" link to navigate to the registration page.
	 */
	async goToRegister(): Promise<void> {
		await this.signUpLink.click();
	}

	/**
	 * Logs out from the currently authenticated session.
	 */
	async logout(): Promise<void> {
		await this.logoutBtn.click();
	}
}
