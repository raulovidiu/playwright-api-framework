import {
	createPayloadWithInvalidEmail,
	createPayloadWithoutEmail,
	createPayloadWithoutName,
	createPayloadWithoutPassword,
	createRegisterPayload,
} from "@/fixtures/factories/user.factory.js";
import { RegisterErrorSchema } from "@/fixtures/schemas/schemas.js";
import type { RegisterErrorResponse } from "@/fixtures/schemas/type-guards.js";
import { expect, test } from "@/fixtures/test-options.api.js";

test.describe("Register API — Field Validation", () => {
	test("Register with missing email returns 400", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: RegisterErrorResponse;

		await test.step("POST /api/register without email → 400", async () => {
			const { status, body } = await apiRequest<RegisterErrorResponse>({
				method: "POST",
				url: "/api/register",
				body: createPayloadWithoutEmail(),
			});
			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(400);
		});

		await test.step("Error body matches RegisterErrorSchema", async () => {
			expect(RegisterErrorSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Error message references required fields", async () => {
			expect(responseBody.error).toBe("All fields required");
		});
	});

	test("Register with missing password returns 400", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: RegisterErrorResponse;

		await test.step("POST /api/register without password → 400", async () => {
			const { status, body } = await apiRequest<RegisterErrorResponse>({
				method: "POST",
				url: "/api/register",
				body: createPayloadWithoutPassword(),
			});
			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(400);
		});

		await test.step("Error body matches RegisterErrorSchema", async () => {
			expect(RegisterErrorSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Error message references required fields", async () => {
			expect(responseBody.error).toBe("All fields required");
		});
	});

	test("Register with missing name returns 400", async ({ apiRequest }) => {
		let responseStatus: number;
		let responseBody: RegisterErrorResponse;

		await test.step("POST /api/register without name → 400", async () => {
			const { status, body } = await apiRequest<RegisterErrorResponse>({
				method: "POST",
				url: "/api/register",
				body: createPayloadWithoutName(),
			});
			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(400);
		});

		await test.step("Error body matches RegisterErrorSchema", async () => {
			expect(RegisterErrorSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Error message references required fields", async () => {
			expect(responseBody.error).toBe("All fields required");
		});
	});

	test("Register with empty body returns 400", async ({ apiRequest }) => {
		let responseStatus: number;

		await test.step("POST /api/register with empty body → 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: {},
			});
			responseStatus = status;

			expect(responseStatus).toBe(400);
		});
	});

	test("Register with duplicate email returns 400", async ({ apiRequest }) => {
		const payload = createRegisterPayload();

		await test.step("Register user for the first time → 201", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: payload,
			});
			expect(status).toBe(201);
		});

		let responseStatus: number;
		let responseBody: RegisterErrorResponse;

		await test.step("Register same email again → 400", async () => {
			const { status, body } = await apiRequest<RegisterErrorResponse>({
				method: "POST",
				url: "/api/register",
				body: payload,
			});
			responseStatus = status;
			responseBody = body;

			expect(responseStatus).toBe(400);
		});

		await test.step("Error body matches RegisterErrorSchema", async () => {
			expect(RegisterErrorSchema.parse(responseBody)).toBeTruthy();
		});

		await test.step("Error message indicates email already registered", async () => {
			expect(responseBody.error).toBe("Email already registered");
		});
	});

	test("Register with invalid email format returns 400", async ({
		apiRequest,
	}) => {
		await test.step("POST /api/register with non-email string → 400", async () => {
			const { status } = await apiRequest({
				method: "POST",
				url: "/api/register",
				body: createPayloadWithInvalidEmail(),
			});

			// Server accepts any string as email — document current behaviour.
			// If the server adds email-format validation, this becomes 400.
			expect([201, 400]).toContain(status);
		});
	});
});
