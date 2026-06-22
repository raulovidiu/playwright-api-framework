/**
 * seed.spec.ts — Bootstrap file for Playwright Agents (Planner / Generator / Healer)
 *
 * This file teaches Claude agents how the framework is set up:
 *  - How to import the custom `apiRequest` fixture
 *  - The base URL (http://localhost:3000)
 *  - The shared response shape { status, body }
 *  - How test.step() is used for structured reporting
 *
 * Agents should follow the patterns here when generating new tests.
 */
import { expect, test } from "../fixtures/test-options.js";

const BASE_URL = "http://localhost:3000";

test.describe("Seed — API Framework Bootstrap", () => {
	test("seed: API is reachable", async ({ apiRequest }) => {
		await test.step("GET /api/health returns 200", async () => {
			const { status, body } = await apiRequest({
				method: "GET",
				url: "/api/health",
				baseUrl: BASE_URL,
			});

			expect(status).toBe(200);
			expect(body).toBeTruthy();
		});
	});
});
