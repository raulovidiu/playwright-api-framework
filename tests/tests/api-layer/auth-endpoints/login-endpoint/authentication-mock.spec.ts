import { BASE_URL } from "../../../../constants.js";
import { expect, test } from "../../../../fixtures/pom/test-options.js";
import type { LoginResponse } from "../../../../types/health.type.js";

type ApiErrorResponse = { error: string; message?: string };

const LOGIN_URL = `${BASE_URL}/api/login`;

const MOCK_LOGIN_RESPONSE: LoginResponse = {
	message: "Login successful",
	user: { id: 99, email: "mock@example.com", name: "Mock User" },
};

test.describe("Authentication API Mocking — Network and Error Scenarios", () => {
	test("Simulate 500 Internal Server Error on login", async ({ page }) => {
		const mockErrorResponse: ApiErrorResponse = {
			error: "Internal Server Error",
			message: "An unexpected error occurred during authentication.",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(LOGIN_URL, async (route) => {
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
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: "a@b.com", password: "pass" }),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, LOGIN_URL);

			expect(status).toBe(500);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Internal Server Error");
		});
	});

	test("Simulate 503 Service Unavailable on login", async ({ page }) => {
		const serviceUnavailableResponse: ApiErrorResponse = {
			error: "Service Unavailable",
			message:
				"The authentication service is temporarily unavailable. Please retry.",
		};

		await test.step("Setup Route Mock for 503 Service Unavailable", async () => {
			await page.route(LOGIN_URL, async (route) => {
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
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: "a@b.com", password: "pass" }),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, LOGIN_URL);

			expect(status).toBe(503);
			expect(body.error).toBe("Service Unavailable");
		});
	});

	test("Simulate total network failure on login (Failed Request)", async ({
		page,
	}) => {
		await test.step("Setup Route Mock to Abort the Network Request", async () => {
			await page.route(LOGIN_URL, async (route) => {
				await route.abort("failed");
			});
		});

		await test.step("Verify Request Throws an Exception Due to Network Failure", async () => {
			const didThrow = await page.evaluate(async (url) => {
				try {
					await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email: "a@b.com", password: "pass" }),
					});
					return false;
				} catch {
					return true;
				}
			}, LOGIN_URL);

			expect(didThrow).toBe(true);
		});
	});

	test("Simulate artificial 3-second latency on login", async ({ page }) => {
		await test.step("Setup Route Mock with 3-Second Delay", async () => {
			await page.route(LOGIN_URL, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: MOCK_LOGIN_RESPONSE,
				});
			});
		});

		await test.step("Verify Login Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: "a@b.com", password: "pass" }),
				});
				const body = (await res.json()) as LoginResponse;
				return { status: res.status, body };
			}, LOGIN_URL);

			expect(status).toBe(200);
			expect(body.user.email).toBe("mock@example.com");
			expect(body.message).toBe("Login successful");
		});
	});

	test("Simulate malformed login response — missing user fields", async ({
		page,
	}) => {
		const malformedPayload = { message: "Login successful" };
		// user object intentionally omitted

		await test.step("Setup Route Mock to Return Malformed Payload", async () => {
			await page.route(LOGIN_URL, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					json: malformedPayload,
				});
			});
		});

		await test.step("Verify Malformed Payload Exposes Missing user Object", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: "a@b.com", password: "pass" }),
				});
				const body = (await res.json()) as Partial<LoginResponse>;
				return { status: res.status, body };
			}, LOGIN_URL);

			expect(status).toBe(200);
			// user object must be absent — confirms the mock is malformed
			expect(body.user).toBeUndefined();
		});
	});

	test("Simulate 401 Unauthorized — invalid credentials via mock", async ({
		page,
	}) => {
		const unauthorizedResponse: ApiErrorResponse = {
			error: "Invalid credentials",
		};

		await test.step("Setup Route Mock for 401 Unauthorized", async () => {
			await page.route(LOGIN_URL, async (route) => {
				await route.fulfill({
					status: 401,
					contentType: "application/json",
					json: unauthorizedResponse,
				});
			});
		});

		await test.step("Verify 401 Status and Error Payload", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: "a@b.com", password: "wrongpass" }),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, LOGIN_URL);

			expect(status).toBe(401);
			expect(body.error).toBe("Invalid credentials");
		});
	});

	test("Simulate 429 Too Many Requests — rate limit exceeded via mock", async ({
		page,
	}) => {
		const rateLimitResponse: ApiErrorResponse = {
			error: "Too Many Requests",
			message:
				"You have exceeded the login attempt limit. Please try again later.",
		};

		await test.step("Setup Route Mock for 429 Too Many Requests", async () => {
			await page.route(LOGIN_URL, async (route) => {
				await route.fulfill({
					status: 429,
					contentType: "application/json",
					json: rateLimitResponse,
				});
			});
		});

		await test.step("Verify 429 Status and Error Payload", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: "a@b.com", password: "pass" }),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, LOGIN_URL);

			expect(status).toBe(429);
			expect(body.error).toBe("Too Many Requests");
		});
	});
});
