import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";

describe("GET /api/database", () => {
  it("returns database connection status", async () => {
    const app = createApp();

    const response = await request(app).get("/api/database");

    expect(response.body).toEqual({
      status: "ok",
      database: "connected",
    });
  });
});
