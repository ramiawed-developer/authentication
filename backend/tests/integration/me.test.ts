import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/db/index.js";
import { meRouter } from "../../src/routes/me/index.js";

function createTestAppWithAuthPayload(payload: Record<string, unknown>) {
  const app = express();

  app.use(express.json());

  app.use((req, _res, next) => {
    Object.assign(req, {
      auth: {
        payload,
      },
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

  it("creates and returns the user when they do not exist", async () => {
    const app = createTestAppWithAuthPayload({
      sub: "auth0|me_create",
      email: "me-create@example.com",
      name: "Me Create",
      picture: "https://example.com/me-create.png",
    });

    const response = await request(app).get("/api/me");

    expect(response.status).toBe(200);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        auth0Id: "auth0|me_create",
        email: "me-create@example.com",
        name: "Me Create",
        picture: "https://example.com/me-create.png",
        role: "USER",
      })
    );

    expect(response.body.user.id).toEqual(expect.any(String));
    expect(response.body.user.createdAt).toEqual(expect.any(String));
    expect(response.body.user.updatedAt).toEqual(expect.any(String));

    const userInDatabase = await prisma.user.findUnique({
      where: {
        auth0Id: "auth0|me_create",
      },
    });

    expect(userInDatabase).not.toBeNull();
    expect(userInDatabase?.email).toBe("me-create@example.com");
  });

  it("updates and returns the user when they already exist", async () => {
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
      picture: "https://example.com/new.png",
    });

    const response = await request(app).get("/api/me");

    expect(response.status).toBe(200);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        auth0Id: "auth0|me_existing",
        email: "new@example.com",
        name: "New Name",
        picture: "https://example.com/new.png",
        role: "USER",
      })
    );

    const userInDatabase = await prisma.user.findUnique({
      where: {
        auth0Id: "auth0|me_existing",
      },
    });

    expect(userInDatabase?.email).toBe("new@example.com");
    expect(userInDatabase?.name).toBe("New Name");
    expect(userInDatabase?.picture).toBe("https://example.com/new.png");
  });
});
