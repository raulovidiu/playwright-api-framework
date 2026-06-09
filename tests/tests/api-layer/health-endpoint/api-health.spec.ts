import { HealthSchema } from "../../../fixtures/api/schemas.js";
import type { HealthResponse } from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";
import { BASE_URL } from "../../../constants.js";


test.describe("API Health Endpoint", () => {
	test("API Health Status", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: HealthResponse;

		await test.step("Validate Health API is Live", async () => {
			const { status, body } = await apiRequest<HealthResponse>({
				method: "GET",
				url: "/api/health",
				baseUrl: BASE_URL,
			});

			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(200);
		});

		await test.step("Response Body Matches HealthSchema", async () => {
			expect(HealthSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Timestamp Received Contains Today's Date", async () => {
			const today = new Date().toISOString().split("T")[0]; // example: "2026-06-03"
			expect(responseBody.timestamp).toContain(today);
		});

		await test.step("Status Strict Equality is Healthy", async () => {
			expect(responseBody.status).toBe("healthy");
		});
	});
});

test.describe("Negative Cases for API Health Endpoint", () => {
	test("Wrong Request Method Returns 404", async ({ apiRequest }) => {
		await test.step("POST to /api/health is be rejected", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/health",
				baseUrl: BASE_URL,
			});

			expect(status).toBe(404);
		});
	});

	test("Non-existent endpoint returns 404", async ({ apiRequest }) => {
		await test.step("GET /api/health/unknown Responds With Not Found", async () => {
			const { status } = await apiRequest({
				method: "GET",
				url: "/api/health/unknown",
				baseUrl: BASE_URL,
			});

			expect(status).toBe(404);
		});
	});

	test("Endpoint is reachable under load (10 sequential calls succeed)", async ({
		apiRequest,
	}) => {
		for (let i = 0; i < 10; i++) {
			await test.step(`Request ${i + 1} of 5`, async () => {
				const { status, body } = await apiRequest<HealthResponse>({
					method: "GET",
					url: "/api/health",
					baseUrl: BASE_URL,
				});

				expect(status).toBe(200);
				expect(body.status).toBe("healthy");
			});
		}
	});
});
