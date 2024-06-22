import { Hono } from "hono";
import { describe, test, expect } from "vitest";

const app = new Hono();

describe("hono service", () => {
  test("GET /", async () => {
    const response = await app.request("/");

    expect(response.status).toBe(200);
    // expect(await response.text()).toBe("Hono is running fiercely 🔥");
  });
});
