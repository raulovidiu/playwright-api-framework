import { ProductsSchema } from "../../../fixtures/api/schemas.js";
import type { ProductsResponse } from "../../../fixtures/api/types-guards.js";
import { expect, test } from "../../../fixtures/pom/test-options.js";

const BASE_URL = "http://localhost:3000";

test.describe("Products API", () => {
  test("Validate Retrieve Products Endpoint", async ({ apiRequest }) => {
    let responseStatus: number;
    let responseBody: ProductsResponse;

    await test.step("Retrieve Products and verify status code is 200", async () => {
      const { status, body } = await apiRequest<ProductsResponse>({
        method: "GET",
        url: "/api/products",
        baseUrl: BASE_URL,
      });

      responseStatus = status;
      responseBody = body;

      expect(responseStatus).toBe(200);
    });

    await test.step("Response Body Matches ProductsSchema", async () => {
      expect(ProductsSchema.parse(responseBody)).toBeTruthy();
    });
  });
});
