import { BASE_URL } from "@/constants.js";
import type { CartResponse } from "@/fixtures/api/types-guards.js";
import { expect, test } from "@/fixtures/pom/test-options.api.js";

type ApiErrorResponse = { error: string; message?: string };

const CART_URL = `${BASE_URL}/api/cart`;

test.describe("Cart API Mocking — Network and Error Scenarios", () => {
	test("Simulate 500 Internal Server Error on fetching cart", async ({
		page,
	}) => {
		const mockErrorResponse: ApiErrorResponse = {
			error: "Internal Server Error",
			message: "An unexpected error occurred while retrieving the cart.",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(CART_URL, async (route) => {
				await route.fulfill({
					status: 500,
					contentType: "application/json",
					json: mockErrorResponse,
				});
			});
		});

		await test.step("Verify Application Handles 500 Status Code", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, CART_URL);

			expect(status).toBe(500);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Internal Server Error");
		});
	});

	test("Simulate 503 Service Unavailable on fetching cart", async ({
		page,
	}) => {
		const serviceUnavailableResponse: ApiErrorResponse = {
			error: "Service Unavailable",
			message: "The cart service is temporarily unavailable. Please retry.",
		};

		await test.step("Setup Route Mock for 503 Service Unavailable", async () => {
			await page.route(CART_URL, async (route) => {
				await route.fulfill({
					status: 503,
					contentType: "application/json",
					json: serviceUnavailableResponse,
				});
			});
		});

		await test.step("Verify Application Handles 503 Status Code", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, CART_URL);

			expect(status).toBe(503);
			expect(body.error).toBe("Service Unavailable");
		});
	});

	test("Simulate total network failure on fetching cart (Failed Request)", async ({
		page,
	}) => {
		await test.step("Setup Route Mock to Abort the Network Request", async () => {
			await page.route(CART_URL, async (route) => {
				await route.abort("failed");
			});
		});

		await test.step("Verify Request Throws an Exception Due to Network Failure", async () => {
			const didThrow = await page.evaluate(async (url) => {
				try {
					await fetch(url, { method: "GET" });
					return false;
				} catch {
					return true;
				}
			}, CART_URL);

			expect(didThrow).toBe(true);
		});
	});

	test("Simulate artificial 3-second latency on fetching cart", async ({
		page,
	}) => {
		const mockCartResponse: CartResponse = {
			items: [],
			total: "0.00",
		};

		await test.step("Setup Route Mock with 3-Second Delay", async () => {
			await page.route(CART_URL, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: mockCartResponse,
				});
			});
		});

		await test.step("Verify Cart Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, { method: "GET" });
				const body = (await res.json()) as CartResponse;
				return { status: res.status, body };
			}, CART_URL);

			expect(status).toBe(200);
			expect(body.items).toEqual([]);
			expect(body.total).toBe("0.00");
		});
	});

	test("Simulate malformed cart response — missing items array", async ({
		page,
	}) => {
		const malformedPayload = { total: "0.00" };

		await test.step("Setup Route Mock to Return Malformed Payload", async () => {
			await page.route(CART_URL, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: malformedPayload,
				});
			});
		});

		await test.step("Verify Malformed Payload Exposes Missing items Object", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, { method: "GET" });
				const body = (await res.json()) as Partial<CartResponse>;
				return { status: res.status, body };
			}, CART_URL);

			expect(status).toBe(200);
			expect(body.items).toBeUndefined();
		});
	});

	test("Simulate 400 Bad Request — Invalid quantity on adding item", async ({
		page,
	}) => {
		const badRequestResponse: ApiErrorResponse = {
			error: "Bad Request",
			message: "Quantity must be a positive integer.",
		};

		await test.step("Setup Route Mock for 400 Bad Request", async () => {
			await page.route(CART_URL, async (route) => {
				if (route.request().method() === "POST") {
					await route.fulfill({
						status: 400,
						contentType: "application/json",
						json: badRequestResponse,
					});
				} else {
					await route.fallback();
				}
			});
		});

		await test.step("Verify 400 Status and Error Payload", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId: 1, quantity: -5 }),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, CART_URL);

			expect(status).toBe(400);
			expect(body.error).toBe("Bad Request");
			expect(body.message).toBe("Quantity must be a positive integer.");
		});
	});

	test("Simulate 404 Not Found — Product does not exist on update", async ({
		page,
	}) => {
		const notFoundResponse: ApiErrorResponse = {
			error: "Not Found",
			message: "The requested product could not be found.",
		};

		const nonExistentItemUrl = `${CART_URL}/999`;

		await test.step("Setup Route Mock for 404 Not Found", async () => {
			await page.route(nonExistentItemUrl, async (route) => {
				await route.fulfill({
					status: 404,
					contentType: "application/json",
					json: notFoundResponse,
				});
			});
		});

		await test.step("Verify 404 Status and Error Payload", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ quantity: 2 }),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, nonExistentItemUrl);

			expect(status).toBe(404);
			expect(body.error).toBe("Not Found");
		});
	});
});
