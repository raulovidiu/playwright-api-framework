import { test as base } from "@playwright/test";
import { HomePage } from "@/page-objects/home-page.js";
import { LoginPage } from "@/page-objects/login-page.js";

export type FrameworkFixtures = {
	homePage: HomePage;
	loginPage: LoginPage;
};

export const test = base.extend<FrameworkFixtures>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},

	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
});

export { expect } from "@playwright/test";
