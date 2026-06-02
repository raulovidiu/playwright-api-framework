import { test as base } from "@playwright/test";
import { HomePage } from "../../page-objects/home-page.js";
// import { NavPage } from '../../pages/clientSite/navPage';
// import { ArticlePage } from '../../pages/clientSite/articlePage';

export type FrameworkFixtures = {
	homePage: HomePage;

	// navPage: NavPage;
};

export const test = base.extend<FrameworkFixtures>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},

	// navPage: async ({ page }, use) => {
	//     await use(new NavPage(page));
	// },
});

export { expect } from "@playwright/test";
