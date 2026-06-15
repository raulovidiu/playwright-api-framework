import { BASE_URL } from "@/constants.js";
import type { CheckoutResponse } from "@/fixtures/api/types-guards.js";
import { expect, test } from "@/fixtures/pom/test-options.js";
import { shippingData } from "@/test-data/shipping-data.js";

type ApiErrorResponse = { error: string; message?: string };

const CHECKOUT_URL = `${BASE_URL}/api/checkout`;

test.describe("Checkout API Mocking — Network and Error Scenarios", () => {
	test("Simulate 500 Internal Server Error on placing order", async ({
		page,
	}) => {
		const mockErrorResponse: ApiErrorResponse = {
			error: "Internal Server Error",
			message: "An unexpected error occurred while processing the checkout.",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(CHECKOUT_URL, async (route) => {
				if (route.request().method() === "POST") {
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

		await test.step("Verify Application Handles 500 Status Code on Checkout", async () => {
			const { status, body } = await page.evaluate(
				async ({ url, shipping }) => {
					const res = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ shipping }),
					});
					const body = (await res.json()) as ApiErrorResponse;
					return { status: res.status, body };
				},
				{ url: CHECKOUT_URL, shipping: shippingData },
			);

			expect(status).toBe(500);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Internal Server Error");
		});
	});

	test("Simulate 503 Service Unavailable on placing order", async ({
		page,
	}) => {
		const serviceUnavailableResponse: ApiErrorResponse = {
			error: "Service Unavailable",
			message:
				"The checkout gateway is temporarily down. Please try again later.",
		};

		await test.step("Setup Route Mock for 503 Service Unavailable", async () => {
			await page.route(CHECKOUT_URL, async (route) => {
				if (route.request().method() === "POST") {
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

		await test.step("Verify Application Handles 503 Status Code on Checkout", async () => {
			const { status, body } = await page.evaluate(
				async ({ url, shipping }) => {
					const res = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ shipping }),
					});
					const body = (await res.json()) as ApiErrorResponse;
					return { status: res.status, body };
				},
				{ url: CHECKOUT_URL, shipping: shippingData },
			);

			expect(status).toBe(503);
			expect(body.error).toBe("Service Unavailable");
		});
	});

	test("Simulate total network failure on checkout (Failed Request)", async ({
		page,
	}) => {
		await test.step("Setup Route Mock to Abort the Checkout Network Request", async () => {
			await page.route(CHECKOUT_URL, async (route) => {
				await route.abort("failed");
			});
		});

		await test.step("Verify Checkout Request Throws an Exception Due to Network Failure", async () => {
			const didThrow = await page.evaluate(
				async ({ url, shipping }) => {
					try {
						await fetch(url, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ shipping }),
						});
						return false;
					} catch {
						return true;
					}
				},
				{ url: CHECKOUT_URL, shipping: shippingData },
			);

			expect(didThrow).toBe(true);
		});
	});

	test("Simulate artificial 3-second latency on processing order", async ({
		page,
	}) => {
		const mockCheckoutResponse: CheckoutResponse = {
			message: "Order placed successfully",
			order: {
				id: 123456789,
				items: [],
				total: "0.00",
				shipping: shippingData,
				date: new Date().toISOString(),
			},
		};

		await test.step("Setup Route Mock with 3-Second Delay for Checkout", async () => {
			await page.route(CHECKOUT_URL, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: mockCheckoutResponse,
				});
			});
		});

		await test.step("Verify Checkout Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(
				async ({ url, shipping }) => {
					const res = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ shipping }),
					});
					const body = (await res.json()) as CheckoutResponse;
					return { status: res.status, body };
				},
				{ url: CHECKOUT_URL, shipping: shippingData },
			);

			expect(status).toBe(200);
			expect(body.message).toBe("Order placed successfully");
			expect(body.order.id).toBe(123456789);
		});
	});

	test("Simulate malformed checkout response — missing order details", async ({
		page,
	}) => {
		const malformedPayload = { message: "Order placed successfully" };

		await test.step("Setup Route Mock to Return Malformed Checkout Payload", async () => {
			await page.route(CHECKOUT_URL, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: malformedPayload,
				});
			});
		});

		await test.step("Verify Malformed Payload Exposes Missing order Object", async () => {
			const { status, body } = await page.evaluate(
				async ({ url, shipping }) => {
					const res = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ shipping }),
					});
					const body = (await res.json()) as Partial<CheckoutResponse>;
					return { status: res.status, body };
				},
				{ url: CHECKOUT_URL, shipping: shippingData },
			);

			expect(status).toBe(200);
			expect(body.order).toBeUndefined();
		});
	});
});
