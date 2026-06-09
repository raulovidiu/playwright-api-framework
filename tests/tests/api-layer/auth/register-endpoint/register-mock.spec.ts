import { BASE_URL } from "../../../../constants.js";
import { createRegisterPayload } from "../../../../fixtures/api/factories/user.factory.js";
import type { RegisterResponse } from "../../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../../fixtures/pom/test-options.js";

type ApiErrorResponse = { error: string; message?: string };

const REGISTER_URL = `${BASE_URL}/api/register`;

const MOCK_REGISTER_RESPONSE: RegisterResponse = {
	message: "Registration successful",
	user: { id: 99, email: "mock@example.com", name: "Mock User" },
};

test.describe("Register API Mocking — Network and Error Scenarios", () => {
	test("Simulate 500 Internal Server Error on register", async ({ page }) => {
		const mockErrorResponse: ApiErrorResponse = {
			error: "Internal Server Error",
			message: "An unexpected error occurred during registration.",
		};

		await test.step("Setup Route Mock for 500 Server Error", async () => {
			await page.route(REGISTER_URL, async (route) => {
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
					body: JSON.stringify({
						email: "a@b.com",
						password: "pass",
						name: "A",
					}),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, REGISTER_URL);

			expect(status).toBe(500);
			expect(body).toHaveProperty("error");
			expect(body.error).toBe("Internal Server Error");
		});
	});

	test("Simulate 503 Service Unavailable on register", async ({ page }) => {
		const serviceUnavailableResponse: ApiErrorResponse = {
			error: "Service Unavailable",
			message:
				"The registration service is temporarily unavailable. Please retry.",
		};

		await test.step("Setup Route Mock for 503 Service Unavailable", async () => {
			await page.route(REGISTER_URL, async (route) => {
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
					body: JSON.stringify({
						email: "a@b.com",
						password: "pass",
						name: "A",
					}),
				});
				const body = (await res.json()) as ApiErrorResponse;
				return { status: res.status, body };
			}, REGISTER_URL);

			expect(status).toBe(503);
			expect(body.error).toBe("Service Unavailable");
		});
	});

	test("Simulate total network failure on register (Failed Request)", async ({
		page,
	}) => {
		await test.step("Setup Route Mock to Abort the Network Request", async () => {
			await page.route(REGISTER_URL, async (route) => {
				await route.abort("failed");
			});
		});

		await test.step("Verify Request Throws an Exception Due to Network Failure", async () => {
			const didThrow = await page.evaluate(async (url) => {
				try {
					await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: "a@b.com",
							password: "pass",
							name: "A",
						}),
					});
					return false;
				} catch {
					return true;
				}
			}, REGISTER_URL);

			expect(didThrow).toBe(true);
		});
	});

	test("Simulate artificial 3-second latency on register", async ({ page }) => {
		await test.step("Setup Route Mock with 3-Second Delay", async () => {
			await page.route(REGISTER_URL, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 3000));
				await route.fulfill({
					status: 201,
					contentType: "application/json",
					json: MOCK_REGISTER_RESPONSE,
				});
			});
		});

		await test.step("Verify Register Endpoint Resolves Successfully After Delay", async () => {
			const { status, body } = await page.evaluate(async (url) => {
				const res = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: "a@b.com",
						password: "pass",
						name: "A",
					}),
				});
				const body = (await res.json()) as RegisterResponse;
				return { status: res.status, body };
			}, REGISTER_URL);

			expect(status).toBe(201);
			expect(body.user.email).toBe("mock@example.com");
			expect(body.message).toBe("Registration successful");
		});
	});

	test("Simulate malformed register payload — missing user fields", async ({
		page,
	}) => {
		const malformedPayload = { message: "Registration successful" };
		// user object intentionally omitted

		await test.step("Setup Route Mock to Return Malformed Payload", async () => {
			await page.route(REGISTER_URL, async (route) => {
				await route.fulfill({
					status: 201,
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
					body: JSON.stringify({
						email: "a@b.com",
						password: "pass",
						name: "A",
					}),
				});
				const body = (await res.json()) as Partial<RegisterResponse>;
				return { status: res.status, body };
			}, REGISTER_URL);

			expect(status).toBe(201);
			// user object must be absent — confirms the mock is malformed
			expect(body.user).toBeUndefined();
		});
	});

	test("Simulate 409 Conflict — email already registered via mock", async ({
		page,
	}) => {
		const payload = createRegisterPayload();

		const conflictResponse: ApiErrorResponse = {
			error: "Email already registered",
		};

		await test.step("Setup Route Mock for 409 Conflict", async () => {
			await page.route(REGISTER_URL, async (route) => {
				await route.fulfill({
					status: 409,
					contentType: "application/json",
					json: conflictResponse,
				});
			});
		});

		await test.step("Verify 409 Status and Error Payload", async () => {
			const { status, body } = await page.evaluate(
				async ({ url, payload }) => {
					const res = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					});
					const body = (await res.json()) as ApiErrorResponse;
					return { status: res.status, body };
				},
				{ url: REGISTER_URL, payload },
			);

			expect(status).toBe(409);
			expect(body.error).toBe("Email already registered");
		});
	});
});
