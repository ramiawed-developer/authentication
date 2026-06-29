import { describe, it, beforeEach, expect } from "vitest";
import express from "express";
import { meRouter } from "../../src/routes/me/me.routes.js";
import { prisma } from "../../src/db/prisma.js";
import request from "supertest";

function createTestAppWithAuthPayload(payload: Record<string, unknown>) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    Object.assign(req, {
      auth: { payload },
    });

    next();
  });
  app.use("/api/me", meRouter);

  return app;
}

describe("GET /api/me", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("creates and return the user when they do not exist", async () => {
    const app = createTestAppWithAuthPayload({
      sub: "auth0|me_create",
      email: "me-create@example.com",
      name: "Me Create",
      picture: "https://example.com/me-create.png",
    });

    const result = await request(app).get("/api/me");

    expect(result.status).toBe(200);
    expect(result.body.user).toEqual(
      expect.objectContaining({
        auth0Id: "auth0|me_create",
        email: "me-create@example.com",
        name: "Me Create",
        picture: "https://example.com/me-create.png",
        role: "USER",
      })
    );

    const userIdDatabase = await prisma.user.findUnique({
      where: {
        auth0Id: "auth0|me_create",
      },
    });

    expect(userIdDatabase).not.toBeNull();
  });

  it("updates and retuns the user when they already exist", async () => {
    await prisma.user.create({
      data: {
        auth0Id: "auth0|me_existing",
        email: "old@example.com",
        name: "Old Name",
        picture: null,
      },
    });

    const app = createTestAppWithAuthPayload({
      sub: "auth0|me_existing",
      email: "new@example.com",
      name: "New Name",
      picture: "https://example.com/new_picture.png",
    });

    const result = await request(app).get("/api/me");

    expect(result.status).toBe(200);
    expect(result.body.user).toEqual(
      expect.objectContaining({
        auth0Id: "auth0|me_existing",
        email: "new@example.com",
        name: "New Name",
        picture: "https://example.com/new_picture.png",
        role: "USER",
      })
    );
  });
});
