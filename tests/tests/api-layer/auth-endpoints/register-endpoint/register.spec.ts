import { createRegisterPayload } from "@/fixtures/factories/user.factory.js";
import { RegisterSchema } from "@/fixtures/schemas/schemas.js";
import type { RegisterResponse } from "@/fixtures/schemas/type-guards.js";
import { expect, test } from "@/fixtures/test-options.api.js";
import { saveArtifact } from "@/utils/save-artifact.js";

test.describe("Register API - Nominal Conditions", () => {
	test("Validate Register with Valid Credentials Returns 201", async ({
		apiRequest,
	}) => {
		let responseStatus: number;
		let responseBody: RegisterResponse;

		await test.step("POST /api/register with valid data → status 201", async () => {
			const { status, body } = await apiRequest<RegisterResponse>({
				method: "POST",
				url: "/api/register",
				body: createRegisterPayload(),
			});

			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(201);

			// Capture the Created User Payload
			await saveArtifact("registered-user", responseBody);
		});

		await test.step("Response Body Matches RegisterSchema", async () => {
			expect(RegisterSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Response contains success message", async () => {
			expect(responseBody.message).toBe("Registration successful");
		});

		await test.step("Response user contains id, email and name", async () => {
			expect(responseBody.user.id).toBeGreaterThan(0);
			expect(responseBody.user.email).toBeTruthy();
			expect(responseBody.user.name).toBeTruthy();
		});
	});

	test("Validate Registered User email matches the submitted email", async ({
		apiRequest,
	}) => {
		const payload = createRegisterPayload();
		let responseBody: RegisterResponse;

		await test.step("POST /api/register and capture response", async () => {
			const { body } = await apiRequest<RegisterResponse>({
				method: "POST",
				url: "/api/register",
				body: payload,
			});
			responseBody = body;
		});

		await test.step("Response user.email equals the submitted email", async () => {
			expect(responseBody.user.email).toBe(payload.email);
		});

		await test.step("Response user.name equals the submitted name", async () => {
			expect(responseBody.user.name).toBe(payload.name);
		});
	});

	test("Validate Registered User receives a positive numeric id", async ({
		apiRequest,
	}) => {
		let responseBody: RegisterResponse;

		await test.step("POST /api/register with unique user data", async () => {
			const { body } = await apiRequest<RegisterResponse>({
				method: "POST",
				url: "/api/register",
				body: createRegisterPayload(),
			});
			responseBody = body;
		});

		await test.step("User id is a positive integer", async () => {
			expect(responseBody.user.id).toBeGreaterThan(0);
			expect(Number.isInteger(responseBody.user.id)).toBe(true);
		});
	});
});

test.describe("Register API - Negative Cases", () => {
	test("Validate Register with Duplicate Email Returns 409", async ({
		apiRequest,
	}) => {
		const payload = createRegisterPayload();

		await test.step("POST /api/register with unique email → first registration succeeds with 201", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: payload,
			});
			expect(status).toBe(201);
		});

		await test.step("POST /api/register with same email again → status 409", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: payload,
			});
			expect(status).toBe(400);
		});
	});

	test("Validate Register without Email Returns 400", async ({
		apiRequest,
	}) => {
		await test.step("POST /api/register without email field → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: {
					password: "ValidPass123!",
					name: "Test User",
				},
			});
			expect(status).toBe(400);
		});
	});

	test("Validate Register without Password Returns 400", async ({
		apiRequest,
	}) => {
		await test.step("POST /api/register without password field → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: {
					email: "test@example.com",
					name: "Test User",
				},
			});
			expect(status).toBe(400);
		});
	});

	test("Validate Register without Name Returns 400", async ({ apiRequest }) => {
		await test.step("POST /api/register without name field → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: {
					email: "test@example.com",
					password: "ValidPass123!",
				},
			});
			expect(status).toBe(400);
		});
	});

	test("Validate Register with Empty Body Returns 400", async ({
		apiRequest,
	}) => {
		await test.step("POST /api/register with empty body → status 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: {},
			});
			expect(status).toBe(400);
		});
	});
});
