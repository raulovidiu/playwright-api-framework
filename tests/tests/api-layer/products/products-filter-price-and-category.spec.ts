import { ProductsSchema } from "../../../fixtures/api/schemas.js";
import type { ProductsResponse } from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";

const BASE_URL = "http://localhost:3000";

test.describe("Products API - maxPrice Query Param", () => {
	const MAX_PRICE = 116;

	test("Validate Products Filtering by maxPrice", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: ProductsResponse;

		await test.step("Retrieve Products With maxPrice Status Code Is 200", async () => {
			const { status, body } = await apiRequest<ProductsResponse>({
				method: "GET",
				url: `/api/products?maxPrice=${MAX_PRICE}`,
				baseUrl: BASE_URL,
			});
			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(200);
		});

		await test.step("Response Body Matches ProductsSchema With maxPrice Filter", async () => {
			expect(ProductsSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("All Returned Products Have Price Less Than Or Equal To maxPrice", async () => {
			for (const product of responseBody) {
				expect(product.price).toBeLessThanOrEqual(MAX_PRICE);
			}
		});

		await test.step("Response Body Is Not Empty", async () => {
			expect(responseBody.length).toBeGreaterThan(0);
		});
	});
});

test.describe("Products API - category Query Param", () => {
	const CATEGORY = "electronics";

	test("Validate Products Filtering by Category", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: ProductsResponse;

		await test.step("Retrieve Products With category Status Code Is 200", async () => {
			const { status, body } = await apiRequest<ProductsResponse>({
				method: "GET",
				url: `/api/products?category=${CATEGORY}`,
				baseUrl: BASE_URL,
			});
			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(200);
		});

		await test.step("Response Body Matches ProductsSchema With category Filter", async () => {
			expect(ProductsSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("All Returned Products Have Correct Category", async () => {
			for (const product of responseBody) {
				expect(product.category).toBe(CATEGORY);
			}
		});

		await test.step("Response Body Is Not Empty", async () => {
			expect(responseBody.length).toBeGreaterThan(0);
		});
	});
});
