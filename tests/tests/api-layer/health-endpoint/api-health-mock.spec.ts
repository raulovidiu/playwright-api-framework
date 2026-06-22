import { BASE_URL } from "@/constants.js";
import { expect, test } from "@/fixtures/test-options.api.js";
import type { MockHealthResponse } from "@/types/health.type.js";

test.describe("API health mocking - Negative cases and Latency", () => {
	test("Simulate a 500 Internal Server Error", async ({ page }) => {
		const mockErrorResponse: MockHealthResponse = {
			status: "unhealthy",
			timestamp: new Date().toISOString(),
			error: "Database connection failed",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(`${BASE_URL}/api/health`, async (route) => {
				await route.fulfill({
					status: 500,
					contentType: "application/json",
					json: mockErrorResponse,
				});
			});
		});

		await test.step("Verify Application Handles 500 Status Code", async () => {
			// page.request bypasses page.route mocks — use page.evaluate so the
			// request goes through the browser and the route interceptor fires.
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = await res.json();
				return { status: res.status, body };
			}, `${BASE_URL}/api/health`);

			expect(status).toBe(500);

			const typedBody = body as MockHealthResponse;
			expect(typedBody.status).toBe("unhealthy");
		});
	});

	test("Delay the Response to Test Timeout Handling", async ({ page }) => {
		const mockHealthyResponse: MockHealthResponse = {
			status: "healthy",
			timestamp: new Date().toISOString(),
		};

		await test.step("Setup Route Mock with Artificial 3-Second Delay", async () => {
			await page.route(`${BASE_URL}/api/health`, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));

				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: mockHealthyResponse,
				});
			});
		});

		await test.step("Verify Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = await res.json();
				return { status: res.status, body };
			}, `${BASE_URL}/api/health`);

			expect(status).toBe(200);

			const typedBody = body as MockHealthResponse;
			expect(typedBody.status).toBe("healthy");
		});
	});

	test("Simulate a total network failure (Failed Request)", async ({
		page,
	}) => {
		await test.step("Setup Route Mock to Abort the Network Request", async () => {
			await page.route(`${BASE_URL}/api/health`, async (route) => {
				await route.abort("failed");
			});
		});

		await test.step("Verify Request Throws an Exception Due to Network Failure", async () => {
			// fetch() inside the browser throws a TypeError on abort —
			// capture the error in evaluate and assert on it from the Node side.
			const didThrow = await page.evaluate(async (url) => {
				try {
					await fetch(url);
					return false;
				} catch {
					return true;
				}
			}, `${BASE_URL}/api/health`);

			expect(didThrow).toBe(true);
		});
	});
});
