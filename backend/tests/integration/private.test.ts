import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app.js";
import request from "supertest";

describe("GET /api/private", () => {
  it("rejects request without an access token", async () => {
    const app = createApp();

    const response = await request(app).get("/api/private");

    expect(response.status).toBe(401);
  });
});
