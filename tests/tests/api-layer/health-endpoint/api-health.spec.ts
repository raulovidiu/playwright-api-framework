import { HealthSchema } from "../../../fixtures/api/schemas.js";
import type { HealthResponse } from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";

const BASE_URL = "http://localhost:3000";

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
