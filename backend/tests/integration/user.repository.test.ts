import { describe, it, expect, beforeEach } from "vitest";
import { PrismaUserRepository } from "../../src/modules/users/index.js";
import { prisma } from "../../src/db/index.js";

describe("UserRepository", () => {
  const repository = new PrismaUserRepository(prisma);

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("creates a user", async () => {
    const user = await repository.create({
      auth0Id: "auth0|user_repository_create",
      name: "Create User",
      email: "create@example.com",
      picture: "https://example.com/avatar.png",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.auth0Id).toBe("auth0|user_repository_create");
    expect(user.name).toBe("Create User");
    expect(user.email).toBe("create@example.com");
    expect(user.picture).toBe("https://example.com/avatar.png");
    expect(user.role).toBe("USER");
  });

  it("finds a user by authId0", async () => {
    await repository.create({
      auth0Id: "auth0|user_repository_create",
      name: "Create User",
      email: "create@example.com",
    });

    const user = await repository.findByAuth0Id("auth0|user_repository_create");

    expect(user).not.toBeNull();
    expect(user?.email).toBe("create@example.com");
  });

  it("returns null when user is not found by auth0Id", async () => {
    const user = await repository.findByAuth0Id("auth0|missing");
    expect(user).toBeNull();
  });

  it("updates a user profile by auth0Id", async () => {
    await repository.create({
      auth0Id: "auth0|user_repository_create",
      name: "Create User",
      email: "create@example.com",
      picture: "https://example.com/avatar.png",
    });

    const updatedUser = await repository.updateProfile("auth0|user_repository_create", {
      email: "new@example.com",
      name: "New Name",
      picture: "https://example.com/new.png",
    });

    expect(updatedUser.email).toBe("new@example.com");
    expect(updatedUser.name).toBe("New Name");
    expect(updatedUser.picture).toBe("https://example.com/new.png");
  });
});
