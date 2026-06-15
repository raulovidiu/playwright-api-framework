import { BASE_URL } from "../../../../constants.js";
import { registerFreshUser } from "../../../../fixtures/api/helpers/user.helper.js";
import { expect, test } from "../../../../fixtures/pom/test-options.js";
import type {
	GetUserResponse,
	LoginResponse,
	LogoutResponse,
} from "../../../../types/user.type.js";

test.describe("Authentication API - Nominal Conditions", () => {
	test("Validate Login with Valid Credentials Returns 200", async ({
		apiRequest,
	}) => {
		let registeredPayload: { email: string; password: string; name: string };
		let responseStatus: number;
		let responseBody: LoginResponse;

		await test.step("Pre-condition: register a new user via POST /api/register", async () => {
			registeredPayload = await registerFreshUser(apiRequest);
		});

		await test.step("POST /api/login with valid credentials → status 200", async () => {
			const { status, body } = await apiRequest<LoginResponse>({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: registeredPayload.email,
					password: registeredPayload.password,
				},
			});

			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(200);
		});

		await test.step("Response contains a success message", async () => {
			expect(responseBody.message).toBeTruthy();
		});

		await test.step("Response user contains id, email and name", async () => {
			expect(responseBody.user.id).toBeGreaterThan(0);
			expect(responseBody.user.email).toBeTruthy();
			expect(responseBody.user.name).toBeTruthy();
		});
	});

	test("Validate Login Response user.email matches the submitted email", async ({
		apiRequest,
	}) => {
		let registeredPayload: { email: string; password: string; name: string };
		let responseBody: LoginResponse;

		await test.step("Pre-condition: register a new user via POST /api/register", async () => {
			registeredPayload = await registerFreshUser(apiRequest);
		});

		await test.step("POST /api/login and capture response", async () => {
			const { body } = await apiRequest<LoginResponse>({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: registeredPayload.email,
					password: registeredPayload.password,
				},
			});

			responseBody = body;
		});

		await test.step("Response user.email equals the submitted email", async () => {
			expect(responseBody.user.email).toBe(registeredPayload.email);
		});

		await test.step("Response user.name equals the submitted name", async () => {
			expect(responseBody.user.name).toBe(registeredPayload.name);
		});
	});

	test("Validate Login Response user receives a positive numeric id", async ({
		apiRequest,
	}) => {
		let registeredPayload: { email: string; password: string; name: string };
		let responseBody: LoginResponse;

		await test.step("Pre-condition: register a new user via POST /api/register", async () => {
			registeredPayload = await registerFreshUser(apiRequest);
		});

		await test.step("POST /api/login with valid credentials", async () => {
			const { body } = await apiRequest<LoginResponse>({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: registeredPayload.email,
					password: registeredPayload.password,
				},
			});

			responseBody = body;
		});

		await test.step("User id is a positive integer", async () => {
			expect(responseBody.user.id).toBeGreaterThan(0);
			expect(Number.isInteger(responseBody.user.id)).toBe(true);
		});
	});

	test("Validate GET /api/user Returns Correct Profile After Login", async ({
		apiRequest,
	}) => {
		let registeredPayload: { email: string; password: string; name: string };
		let userResponseBody: GetUserResponse;

		await test.step("Pre-condition: register a new user via POST /api/register", async () => {
			registeredPayload = await registerFreshUser(apiRequest);
		});

		await test.step("POST /api/login with valid credentials → status 200", async () => {
			const { status } = await apiRequest<LoginResponse>({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: registeredPayload.email,
					password: registeredPayload.password,
				},
			});

			expect(status).toBe(200);
		});

		await test.step("GET /api/user → status 200", async () => {
			const { status, body } = await apiRequest<GetUserResponse>({
				method: "GET",
				url: "/api/user",
				baseUrl: BASE_URL,
			});

			expect(status).toBe(200);
			userResponseBody = body;
		});

		await test.step("GET /api/user response contains id, email and name", async () => {
			expect(userResponseBody.id).toBeGreaterThan(0);
			expect(userResponseBody.email).toBeTruthy();
			expect(userResponseBody.name).toBeTruthy();
		});

		await test.step("GET /api/user email matches the registered email", async () => {
			expect(userResponseBody.email).toBe(registeredPayload.email);
		});

		await test.step("GET /api/user name matches the registered name", async () => {
			expect(userResponseBody.name).toBe(registeredPayload.name);
		});
	});

	test("Validate POST /api/logout Returns 200 with Logged Out Message", async ({
		apiRequest,
	}) => {
		let registeredPayload: { email: string; password: string; name: string };
		let logoutResponseBody: LogoutResponse;
		let logoutStatus: number;

		await test.step("Pre-condition: register a new user via POST /api/register", async () => {
			registeredPayload = await registerFreshUser(apiRequest);
		});

		await test.step("POST /api/login with valid credentials → status 200", async () => {
			const { status } = await apiRequest<LoginResponse>({
				method: "POST",
				url: "/api/login",
				baseUrl: BASE_URL,
				body: {
					email: registeredPayload.email,
					password: registeredPayload.password,
				},
			});

			expect(status).toBe(200);
		});

		await test.step("POST /api/logout → status 200", async () => {
			const { status, body } = await apiRequest<LogoutResponse>({
				method: "POST",
				url: "/api/logout",
				baseUrl: BASE_URL,
			});

			logoutStatus = status;
			logoutResponseBody = body;

			expect(logoutStatus).toBe(200);
		});

		await test.step("Logout response contains expected message", async () => {
			expect(logoutResponseBody.message).toBe("Logged out");
		});
	});
});
