import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environmentPath =
	process.env.ENVIRONMENT === undefined
		? join(__dirname, ".env", ".env.local")
		: join(__dirname, ".env", `.env.${process.env.ENVIRONMENT}`);

dotenv.config({ path: environmentPath });

export default defineConfig({
	tsconfig: './tsconfig.json',
	testDir: "./tests",
	fullyParallel: true,
	workers: 4,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: [["html"], ["list"]],
	use: {
		baseURL: process.env.BASE_URL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "on-first-retry",
	},
	projects: [
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
	],
	webServer: {
		command: `cd ${__dirname}/../app && npm start`,
		url: process.env.BASE_URL ?? "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
