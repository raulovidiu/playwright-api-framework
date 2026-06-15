import { BASE_URL } from "../../../constants.js";
import type {
	OrderItemsResponse,
} from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";
import { shippingData } from "../../../test-data/shipping-data.js";

type ApiErrorResponse = { error: string; message?: string };

const ORDER_BASE_URL = `${BASE_URL}/api/orders`;

test.describe("Orders API Mocking — Network and Error Scenarios", () => {
	test("Simulate 404 Not Found when fetching a non-existent order", async ({
		page,
	}) => {
		const orderId = 999999999;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const notFoundResponse: ApiErrorResponse = {
			error: "Not Found",
			message: `Order with id ${orderId} does not exist.`,
		};

		await test.step("Setup Route Mock for 404 Not Found", async () => {
			await page.route(ORDER_URL, async (route) => {
				if (route.request().method() === "GET") {
					await route.fulfill({
						status: 404,
						contentType: "application/json",
						json: notFoundResponse,
					});
				} else {
					await route.fallback();
				}
			});
		});

		await test.step("Verify Application Handles 404 Status Code on Order Fetch", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as ApiErrorResponse;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(404);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Not Found");
		});
	});

	test("Simulate 500 Internal Server Error when fetching an order", async ({
		page,
	}) => {
		const orderId = 123;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const mockErrorResponse: ApiErrorResponse = {
			error: "Internal Server Error",
			message: "An unexpected error occurred while retrieving the order.",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(ORDER_URL, async (route) => {
				if (route.request().method() === "GET") {
					await route.fulfill({
						status: 500,
						contentType: "application/json",
						json: mockErrorResponse,
					});
				} else {
					await route.fallback();
				}
			});
		});

		await test.step("Verify Application Handles 500 Status Code on Order Fetch", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as ApiErrorResponse;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(500);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Internal Server Error");
		});
	});

	test("Simulate 503 Service Unavailable when fetching an order", async ({
		page,
	}) => {
		const orderId = 123;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const serviceUnavailableResponse: ApiErrorResponse = {
			error: "Service Unavailable",
			message:
				"The order service is temporarily down. Please try again later.",
		};

		await test.step("Setup Route Mock for 503 Service Unavailable", async () => {
			await page.route(ORDER_URL, async (route) => {
				if (route.request().method() === "GET") {
					await route.fulfill({
						status: 503,
						contentType: "application/json",
						json: serviceUnavailableResponse,
					});
				} else {
					await route.fallback();
				}
			});
		});

		await test.step("Verify Application Handles 503 Status Code on Order Fetch", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as ApiErrorResponse;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(503);
			expect(body.error).toBe("Service Unavailable");
		});
	});

	test("Simulate total network failure when fetching an order (Failed Request)", async ({
		page,
	}) => {
		const orderId = 123;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		await test.step("Setup Route Mock to Abort the Order Network Request", async () => {
			await page.route(ORDER_URL, async (route) => {
				await route.abort("failed");
			});
		});

		await test.step("Verify Order Request Throws an Exception Due to Network Failure", async () => {
			const didThrow = await page.evaluate(
				async ({ url }) => {
					try {
						await fetch(url, { method: "GET" });
						return false;
					} catch {
						return true;
					}
				},
				{ url: ORDER_URL },
			);

			expect(didThrow).toBe(true);
		});
	});

	test("Simulate artificial 3-second latency when fetching an order", async ({
		page,
	}) => {
		const orderId = 123;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const mockOrderResponse: OrderItemsResponse = {
			id: orderId,
			items: [
				{ productId: 1, quantity: 2 },
			],
			total: "49.98",
			shipping: shippingData,
			date: new Date().toISOString(),
		};

		await test.step("Setup Route Mock with 3-Second Delay for Order Fetch", async () => {
			await page.route(ORDER_URL, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: mockOrderResponse,
				});
			});
		});

		await test.step("Verify Order Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as OrderItemsResponse;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(200);
			expect(body.id).toBe(orderId);
			expect(body.items).toBeDefined();
		});
	});

	test("Simulate malformed order response — missing items and shipping details", async ({
		page,
	}) => {
		const orderId = 123;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const malformedPayload = { id: orderId, total: "49.98" };

		await test.step("Setup Route Mock to Return Malformed Order Payload", async () => {
			await page.route(ORDER_URL, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: malformedPayload,
				});
			});
		});

		await test.step("Verify Malformed Payload Exposes Missing items and shipping Fields", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as Partial<OrderItemsResponse>;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(200);
			expect(body.items).toBeUndefined();
			expect(body.shipping).toBeUndefined();
		});
	});

	test("Simulate successful order fetch with one product in order items", async ({
		page,
	}) => {
		const orderId = 100;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const mockOrderResponse: OrderItemsResponse = {
			id: orderId,
			items: [{ productId: 1, quantity: 2 }],
			total: "29.99",
			shipping: shippingData,
			date: new Date().toISOString(),
		};

		await test.step("Setup Route Mock for Successful Single-Product Order Fetch", async () => {
			await page.route(ORDER_URL, async (route) => {
				if (route.request().method() === "GET") {
					await route.fulfill({
						status: 200,
						contentType: "application/json",
						json: mockOrderResponse,
					});
				} else {
					await route.fallback();
				}
			});
		});

		await test.step("Verify Order Response Returns 200 With Correct Order Data", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as OrderItemsResponse;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(200);
			expect(body.id).toBe(orderId);
			expect(body.items.length).toBe(1);
			expect(body.items[0]!.productId).toBe(1);
			expect(body.items[0]!.quantity).toBe(2);
			expect(body.shipping).toEqual(shippingData);
		});
	});

	test("Simulate successful order fetch with multiple products in order items", async ({
		page,
	}) => {
		const orderId = 101;
		const ORDER_URL = `${ORDER_BASE_URL}/${orderId}`;

		const mockOrderResponse: OrderItemsResponse = {
			id: orderId,
			items: [
				{ productId: 2, quantity: 1 },
				{ productId: 4, quantity: 1 },
			],
			total: "59.98",
			shipping: shippingData,
			date: new Date().toISOString(),
		};

		await test.step("Setup Route Mock for Successful Multi-Product Order Fetch", async () => {
			await page.route(ORDER_URL, async (route) => {
				if (route.request().method() === "GET") {
					await route.fulfill({
						status: 200,
						contentType: "application/json",
						json: mockOrderResponse,
					});
				} else {
					await route.fallback();
				}
			});
		});

		await test.step("Verify Order Response Returns 200 With All Distinct Products", async () => {
			const { status, body } = await page.evaluate(
				async ({ url }) => {
					const res = await fetch(url, { method: "GET" });
					const body = (await res.json()) as OrderItemsResponse;
					return { status: res.status, body };
				},
				{ url: ORDER_URL },
			);

			expect(status).toBe(200);
			expect(body.id).toBe(orderId);
			expect(body.items.length).toBe(2);

			const productIds = body.items.map((item) => item.productId);
			expect(productIds).toContain(2);
			expect(productIds).toContain(4);
			expect(body.shipping).toEqual(shippingData);
		});
	});
});
