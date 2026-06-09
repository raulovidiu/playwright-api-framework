import { BASE_URL } from "../../../../constants.js";
import { registerFreshUser } from "../../../../fixtures/api/helpers/user.helper.js";
import { expect, test } from "../../../../fixtures/pom/test-options.js";

test.describe("Authentication API - Negative Cases", () => {
	test("Validate Login with Wrong Password Returns 401", async ({
		apiRequest,
	}) => {
		let registeredPayload: { email: string; password: string; name: string };

		await test.step("Pre-condition: register a new user via POST /api/register", async () => {
			registeredPayload = await registerFreshUser(apiRequest);
		});

		await test.step("POST /api/login with correct email but wrong password → status 401", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: registeredPayload.email,
					password: "WrongPassword999!",
				},
			});

			expect(status).toBe(401);
		});
	});

	test("Validate Login with Non-Existent Email Returns 401", async ({
		apiRequest,
	}) => {
		await test.step("POST /api/login with unknown email → status 401", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: "nonexistent@example.com",
					password: "ValidPass123!",
				},
			});

			expect(status).toBe(401);
		});
	});

	test("Validate Login without Email Returns 400", async ({ apiRequest }) => {
		await test.step("POST /api/login without email field → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					password: "ValidPass123!",
				},
			});

			expect(status).toBe(400);
		});
	});

	test("Validate Login without Password Returns 400", async ({
		apiRequest,
	}) => {
		await test.step("POST /api/login without password field → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: "test@example.com",
				},
			});

			expect(status).toBe(400);
		});
	});

	test("Validate Login with Empty Body Returns 400", async ({ apiRequest }) => {
		await test.step("POST /api/login with empty body → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {},
			});

			expect(status).toBe(400);
		});
	});
});
