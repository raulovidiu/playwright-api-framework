import { expect, test } from "@playwright/test";

/**
 * API Tests
 * Tests for the TechMart REST API endpoints
 */

const BASE_URL = "http://localhost:3000";

test.describe("API Tests", () => {
	test.describe("Cart API", () => {
		test.beforeEach(async ({ request }) => {
			// Clear cart before each test
			await request.delete(`${BASE_URL}/api/cart`);
		});

		test("GET /api/cart should return empty cart initially", async ({
			request,
		}) => {
			const response = await request.get(`${BASE_URL}/api/cart`);

			expect(response.ok()).toBeTruthy();

			const cart = await response.json();
			expect(cart.items).toEqual([]);
			expect(cart.total).toBe("0.00");
		});

		test("POST /api/cart should add item to cart", async ({ request }) => {
			const response = await request.post(`${BASE_URL}/api/cart`, {
				data: { productId: 1, quantity: 2 },
			});

			expect(response.ok()).toBeTruthy();

			const data = await response.json();
			expect(data.message).toBe("Added to cart");
			expect(data.cart.length).toBe(1);
			expect(data.cart[0].productId).toBe(1);
			expect(data.cart[0].quantity).toBe(2);
		});

		test("POST /api/cart should return 404 for non-existent product", async ({
			request,
		}) => {
			const response = await request.post(`${BASE_URL}/api/cart`, {
				data: { productId: 999, quantity: 1 },
			});

			expect(response.status()).toBe(404);

			const data = await response.json();
			expect(data.error).toBe("Product not found");
		});

		test("PUT /api/cart/:productId should update quantity", async ({
			request,
		}) => {
			// Add item first
			await request.post(`${BASE_URL}/api/cart`, {
				data: { productId: 1, quantity: 1 },
			});

			// Update quantity
			const response = await request.put(`${BASE_URL}/api/cart/1`, {
				data: { quantity: 5 },
			});

			expect(response.ok()).toBeTruthy();

			const data = await response.json();
			expect(data.cart[0].quantity).toBe(5);
		});

		test("DELETE /api/cart/:productId should remove item", async ({
			request,
		}) => {
			// Add item first
			await request.post(`${BASE_URL}/api/cart`, {
				data: { productId: 1, quantity: 1 },
			});

			// Remove item
			const response = await request.delete(`${BASE_URL}/api/cart/1`);

			expect(response.ok()).toBeTruthy();

			// Verify cart is empty
			const cartResponse = await request.get(`${BASE_URL}/api/cart`);
			const cart = await cartResponse.json();
			expect(cart.items.length).toBe(0);
		});

		test("DELETE /api/cart should clear entire cart", async ({ request }) => {
			// Add multiple items
			await request.post(`${BASE_URL}/api/cart`, {
				data: { productId: 1, quantity: 1 },
			});
			await request.post(`${BASE_URL}/api/cart`, {
				data: { productId: 2, quantity: 1 },
			});

			// Clear cart
			const response = await request.delete(`${BASE_URL}/api/cart`);

			expect(response.ok()).toBeTruthy();

			// Verify cart is empty
			const cartResponse = await request.get(`${BASE_URL}/api/cart`);
			const cart = await cartResponse.json();
			expect(cart.items.length).toBe(0);
		});
	});

	test.describe("Auth API", () => {
		test("POST /api/login should succeed with valid credentials", async ({
			request,
		}) => {
			const response = await request.post(`${BASE_URL}/api/login`, {
				data: { email: "demo@techmart.com", password: "demo123" },
			});

			expect(response.ok()).toBeTruthy();

			const data = await response.json();
			expect(data.message).toBe("Login successful");
			expect(data.user.email).toBe("demo@techmart.com");
		});

		test("POST /api/login should fail with invalid credentials", async ({
			request,
		}) => {
			const response = await request.post(`${BASE_URL}/api/login`, {
				data: { email: "wrong@email.com", password: "wrongpassword" },
			});

			expect(response.status()).toBe(401);

			const data = await response.json();
			expect(data.error).toBe("Invalid credentials");
		});

		test("POST /api/login should require email and password", async ({
			request,
		}) => {
			const response = await request.post(`${BASE_URL}/api/login`, {
				data: {},
			});

			expect(response.status()).toBe(400);

			const data = await response.json();
			expect(data.error).toBe("Email and password required");
		});

		test("POST /api/register should create new user", async ({ request }) => {
			const uniqueEmail = `test${Date.now()}@example.com`;

			const response = await request.post(`${BASE_URL}/api/register`, {
				data: {
					name: "Test User",
					email: uniqueEmail,
					password: "password123",
				},
			});

			expect(response.status()).toBe(201);

			const data = await response.json();
			expect(data.message).toBe("Registration successful");
			expect(data.user.email).toBe(uniqueEmail);
		});
	});

	test.describe("Health API", () => {
		test("GET /api/health should return healthy status", async ({
			request,
		}) => {
			const response = await request.get(`${BASE_URL}/api/health`);

			expect(response.ok()).toBeTruthy();

			const data = await response.json();
			expect(data.status).toBe("healthy");
			expect(data.timestamp).toBeDefined();
		});
	});
});
