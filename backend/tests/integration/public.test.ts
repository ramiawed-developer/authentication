import request from "supertest";
import { createApp } from "../../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /api/public", () => {
  it("returns public data without authentication", async () => {
    const app = createApp();

    const response = await request(app).get("/api/public");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("This is a public endpoint. No access token required");
  });
});
