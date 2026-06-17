import { test as base } from "@playwright/test";
import { HomePage } from "@/page-objects/home-page.js";
import { LoginPage } from "@/page-objects/login-page.js";
import { RegisterPage } from "@/page-objects/register-page.js";

export type FrameworkFixtures = {
	homePage: HomePage;
	loginPage: LoginPage;
	registerPage: RegisterPage;
};

export const test = base.extend<FrameworkFixtures>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},

	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},

	registerPage: async ({ page }, use) => {
		await use(new RegisterPage(page));
	},
});

export { expect } from "@playwright/test";
