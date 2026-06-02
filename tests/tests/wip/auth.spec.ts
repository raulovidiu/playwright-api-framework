import { expect, test } from "@playwright/test";

/**
 * Authentication Tests
 * Tests for login, registration, and logout functionality
 */

test.describe("Authentication", () => {
  test.describe("Login", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login.html");
    });

    test("should display login form", async ({ page }) => {
      await expect(page.locator("h1")).toHaveText("Login to TechMart");
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test("should show error for invalid credentials", async ({ page }) => {
      // Fill in invalid credentials
      await page.locator("#email").fill("wrong@email.com");
      await page.locator("#password").fill("wrongpassword");

      // Submit form
      await page.locator('button[type="submit"]').click();

      // Verify error message
      const errorMessage = page.locator("#errorMessage");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText("Invalid credentials");
    });

    test("should login successfully with valid credentials", async ({
      page,
    }) => {
      // Fill in valid demo credentials
      await page.locator("#email").fill("demo@techmart.com");
      await page.locator("#password").fill("demo123");

      // Submit form
      await page.locator('button[type="submit"]').click();

      // Verify toast message
      const toast = page.locator("#toast");
      await expect(toast).toContainText("Login successful");

      // Verify redirect to homepage
      await page.waitForURL("/");
    });

    test("should show validation for empty fields", async ({ page }) => {
      // Try to submit empty form
      await page.locator('button[type="submit"]').click();

      // Check that email field shows validation error (browser built-in)
      const emailInput = page.locator("#email");
      const isInvalid = await emailInput.evaluate((el) => !el.checkValidity());
      expect(isInvalid).toBe(true);
    });

    test("should have link to registration page", async ({ page }) => {
      const signUpLink = page.locator("text=Sign up here");
      await expect(signUpLink).toBeVisible();

      await signUpLink.click();
      await expect(page).toHaveURL("/register.html");
    });

    test("should display demo credentials", async ({ page }) => {
      const demoSection = page.locator(".demo-credentials");
      await expect(demoSection).toBeVisible();
      await expect(demoSection).toContainText("demo@techmart.com");
      await expect(demoSection).toContainText("demo123");
    });
  });

  test.describe("Registration", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/register.html");
    });

    test("should display registration form", async ({ page }) => {
      await expect(page.locator("h1")).toHaveText("Create Your Account");
      await expect(page.locator("#name")).toBeVisible();
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator("#confirmPassword")).toBeVisible();
    });

    test("should show error for mismatched passwords", async ({ page }) => {
      await page.locator("#name").fill("Test User");
      await page.locator("#email").fill("test@example.com");
      await page.locator("#password").fill("password123");
      await page.locator("#confirmPassword").fill("different123");

      await page.locator('button[type="submit"]').click();

      const errorMessage = page.locator("#errorMessage");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText("Passwords do not match");
    });

    test("should register new user successfully", async ({ page }) => {
      // Generate unique email to avoid conflicts
      const uniqueEmail = `test${Date.now()}@example.com`;

      await page.locator("#name").fill("New User");
      await page.locator("#email").fill(uniqueEmail);
      await page.locator("#password").fill("password123");
      await page.locator("#confirmPassword").fill("password123");

      await page.locator('button[type="submit"]').click();

      // Verify toast message
      const toast = page.locator("#toast");
      await expect(toast).toContainText("Account created");

      // Verify redirect to homepage
      await page.waitForURL("/");
    });

    test("should have link to login page", async ({ page }) => {
      const loginLink = page.locator("text=Login here");
      await expect(loginLink).toBeVisible();

      await loginLink.click();
      await expect(page).toHaveURL("/login.html");
    });
  });

  test.describe("Logout", () => {
    test("should logout successfully", async ({ page }) => {
      // Login first
      await page.goto("/login.html");
      await page.locator("#email").fill("demo@techmart.com");
      await page.locator("#password").fill("demo123");
      await page.locator('button[type="submit"]').click();

      // Wait for redirect and user to be logged in
      await page.waitForURL("/");

      // Verify logged in state
      await expect(page.locator("#authArea")).toContainText("Hi, Demo User");

      // Click logout button
      await page.locator("#logoutBtn").click();

      // Verify logged out state
      await expect(page.locator("#authArea")).toContainText("Login");
    });
  });
});
