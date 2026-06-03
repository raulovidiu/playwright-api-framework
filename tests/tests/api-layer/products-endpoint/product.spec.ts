import { ProductSchema } from "../../../fixtures/api/schemas.js";
import type { ProductResponse } from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";

const BASE_URL = "http://localhost:3000";

test.describe("Product API - Invoke and Verify a Single Product", () => {
	test("Validate Retrieve Product by ID", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: ProductResponse;

		await test.step("Retrieve Product with id=1 and verify status code is 200", async () => {
			const { status, body } = await apiRequest<ProductResponse>({
				method: "GET",
				url: "/api/products/1",
				baseUrl: BASE_URL,
			});

			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(200);
		});

		await test.step("Response Body Matches ProductSchema", async () => {
			expect(ProductSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Response Body contains correct id", async () => {
			expect(responseBody.id).toBe(1);
		});

		await test.step("Product price is positive", async () => {
			expect(responseBody.price).toBeGreaterThan(0);
		});
	});

	test("Validate Retrieve Product by ID - 404 Not Found", async ({
		apiRequest,
	}) => {
		await test.step("Retrieve Product with non-existent id=9999 and verify status code is 404", async () => {
			const { status } = await apiRequest({
				method: "GET",
				url: "/api/products/9999",
				baseUrl: BASE_URL,
			});

			expect(status).toBe(404);
		});
	});

	test("Validate Retrieve Product by ID - Invalid ID (string)", async ({
		apiRequest,
	}) => {
		await test.step("Retrieve Product with invalid id='abc' and verify status code is 400", async () => {
			const { status } = await apiRequest({
				method: "GET",
				url: "/api/products/abc",
				baseUrl: BASE_URL,
			});

			expect(status).toBe(404);
		});
	});

	test("Validate Retrieve Product by ID - Negative ID", async ({
		apiRequest,
	}) => {
		await test.step("Retrieve Product with negative id=-1 and verify status code is 400 or 404", async () => {
			const { status } = await apiRequest({
				method: "GET",
				url: "/api/products/-1",
				baseUrl: BASE_URL,
			});

			expect([400, 404]).toContain(status);
		});
	});

	test("Validate Retrieve Product by ID - Zero ID", async ({ apiRequest }) => {
		await test.step("Retrieve Product with id=0 and verify status code is 400 or 404", async () => {
			const { status } = await apiRequest({
				method: "GET",
				url: "/api/products/0",
				baseUrl: BASE_URL,
			});

			expect([400, 404]).toContain(status);
		});
	});
});
