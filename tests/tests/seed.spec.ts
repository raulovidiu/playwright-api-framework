/**
 * seed.spec.ts — Bootstrap file for Playwright Agents (Planner / Generator / Healer)
 *
 * This file teaches Claude agents how the framework is set up:
 *  - How to import the custom `apiRequest` fixture
 *  - Relative URLs are resolved automatically via baseURL set in playwright.config.ts
 *  - The shared response shape { status, body }
 *  - How test.step() is used for structured reporting
 *
 * Agents should follow the patterns here when generating new tests.
 */
import { expect, test } from "../fixtures/test-options.js";

test.describe("Seed — API Framework Bootstrap", () => {
	test("seed: API is reachable", async ({ apiRequest }) => {
		await test.step("GET /api/health returns 200", async () => {
			const { status, body } = await apiRequest({
				method: "GET",
				url: "/api/health",
			});

			expect(status).toBe(200);
			expect(body).toBeTruthy();
		});
	});
});
