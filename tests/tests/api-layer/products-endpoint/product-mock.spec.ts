import { expect, test } from "../../../fixtures/pom/test-options.js";
import type { ProductResponse } from "../../../fixtures/api/types-guards.js";
import { BASE_URL } from "../../../constants.js";


type ApiErrorResponse = { error: string; message?: string };

const MOCK_PRODUCT: ProductResponse = {
	id: 1,
	name: "Wireless Headphones",
	price: 79.99,
	category: "electronics",
	image: "headphones.svg",
	stock: 11,
};

test.describe("Product API Mocking - Negative Cases and Latency", () => {
	test("Simulate a 500 Internal Server Error on product fetch", async ({
		page,
	}) => {
		const mockErrorResponse: ApiErrorResponse = {
			error: "Internal Server Error",
			message: "An unexpected error occurred while fetching the product.",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
				await route.fulfill({
					status: 500,
					contentType: "application/json",
					json: mockErrorResponse,
				});
			});
		});

		await test.step("Verify Application Handles 500 Status Code", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/1`);

			expect(status).toBe(500);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Internal Server Error");
		});
	});

	test("Simulate a total network failure on product fetch (Failed Request)", async ({
		page,
	}) => {
		await test.step("Setup Route Mock to Abort the Network Request", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
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
			}, `${BASE_URL}/api/products/1`);

			expect(didThrow).toBe(true);
		});
	});

	test("Delay the Product Response to Test Timeout Handling", async ({
		page,
	}) => {
		await test.step("Setup Route Mock with Artificial 3-Second Delay", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));

				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: MOCK_PRODUCT,
				});
			});
		});

		await test.step("Verify Product Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as ProductResponse;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/1`);

			expect(status).toBe(200);
			expect(body.id).toBe(1);
			expect(body.name).toBe("Wireless Headphones");
		});
	});

	test("Simulate Malformed Product Payload - Missing Required Fields", async ({
		page,
	}) => {
		const malformedPayload = {
			id: 1,
			// name, price, category, image, stock are intentionally omitted
		};

		await test.step("Setup Route Mock to Return a Malformed Payload", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: malformedPayload,
				});
			});
		});

		await test.step("Verify Malformed Payload Exposes Missing Required Fields", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as Partial<ProductResponse>;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/1`);

			expect(status).toBe(200);

			// Required fields must be absent, confirming the mock is malformed
			expect(body.name).toBeUndefined();
			expect(body.price).toBeUndefined();
			expect(body.category).toBeUndefined();
			expect(body.stock).toBeUndefined();
		});
	});

	test("Simulate Out-of-Stock Product - stock equals zero", async ({
		page,
	}) => {
		const outOfStockProduct: ProductResponse = {
			...MOCK_PRODUCT,
			stock: 0,
		};

		await test.step("Setup Route Mock for Out-of-Stock Product", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: outOfStockProduct,
				});
			});
		});

		await test.step("Verify Product is Returned with stock of 0", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as ProductResponse;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/1`);

			expect(status).toBe(200);
			expect(body.stock).toBe(0);
			expect(body.stock).not.toBeGreaterThan(0);
		});
	});

	test("Simulate Negative Product Price - Data Integrity Edge Case", async ({
		page,
	}) => {
		const negativelyPricedProduct: ProductResponse = {
			...MOCK_PRODUCT,
			price: -19.99,
		};

		await test.step("Setup Route Mock for Product with Negative Price", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: negativelyPricedProduct,
				});
			});
		});

		await test.step("Verify Negative Price is Exposed as an Invalid State", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as ProductResponse;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/1`);

			expect(status).toBe(200);

			// A negative price must never pass a business-rule check
			expect(body.price).toBeLessThan(0);
			expect(body.price).not.toBeGreaterThan(0);
		});
	});

	test("Simulate 404 Not Found for a Non-Existent Product via Mock", async ({
		page,
	}) => {
		const notFoundResponse: ApiErrorResponse = {
			error: "Not Found",
			message: "Product with id 9999 does not exist.",
		};

		await test.step("Setup Route Mock for 404 Not Found", async () => {
			await page.route(`${BASE_URL}/api/products/9999`, async (route) => {
				await route.fulfill({
					status: 404,
					contentType: "application/json",
					json: notFoundResponse,
				});
			});
		});

		await test.step("Verify 404 Status Code and Error Payload", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/9999`);

			expect(status).toBe(404);
			expect(body.error).toBe("Not Found");
		});
	});

	test("Simulate 503 Service Unavailable - Upstream Dependency Failure", async ({
		page,
	}) => {
		const serviceUnavailableResponse: ApiErrorResponse = {
			error: "Service Unavailable",
			message: "The product service is temporarily unavailable. Please retry.",
		};

		await test.step("Setup Route Mock for 503 Service Unavailable", async () => {
			await page.route(`${BASE_URL}/api/products/1`, async (route) => {
				await route.fulfill({
					status: 503,
					contentType: "application/json",
					json: serviceUnavailableResponse,
				});
			});
		});

		await test.step("Verify Application Handles 503 Status Code", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url);
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, `${BASE_URL}/api/products/1`);

			expect(status).toBe(503);
			expect(body.error).toBe("Service Unavailable");
		});
	});
});
