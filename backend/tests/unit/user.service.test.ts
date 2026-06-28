import { User } from "../../src/generated/prisma/client.js";
import { UserService, type UserRepository } from "../../src/modules/users/index.js";
import { describe, it, vi, expect } from "vitest";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-id",
    auth0Id: "auth0|123",
    email: "user@example.com",
    name: "Test User",
    picture: null,
    role: "USER",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function createMockRespository(): UserRepository {
  return {
    findByAuth0Id: vi.fn(),
    create: vi.fn(),
    updateProfile: vi.fn(),
  } as unknown as UserRepository;
}

describe("UserService", () => {
  it("creates a user when no existing user is found", async () => {
    const repository = createMockRespository();
    const service = new UserService(repository);

    vi.mocked(repository.findByAuth0Id).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue(
      createMockUser({
        auth0Id: "auth0|new",
        email: "new@example.com",
      })
    );

    const user = await service.findOrCreateFromAuth0Profile({
      auth0Id: "auth0|new",
      email: "new@example.com",
      name: "New User",
      picture: null,
    });

    expect(repository.findByAuth0Id).toHaveBeenCalledWith("auth0|new");
    expect(repository.create).toHaveBeenCalledWith({
      auth0Id: "auth0|new",
      email: "new@example.com",
      name: "New User",
      picture: null,
    });
    expect(repository.updateProfile).not.toHaveBeenCalled();
    expect(user.auth0Id).toBe("auth0|new");
  });

  it("updates and returns existing user when found", async () => {
    const repository = createMockRespository();
    const service = new UserService(repository);

    vi.mocked(repository.findByAuth0Id).mockResolvedValue(
      createMockUser({
        auth0Id: "auth0|existing",
        email: "old@example.com",
      })
    );

    vi.mocked(repository.updateProfile).mockResolvedValue(
      createMockUser({
        auth0Id: "auth0|existing",
        email: "new@example.com",
        name: "Updated User",
      })
    );

    const user = await service.findOrCreateFromAuth0Profile({
      auth0Id: "auth0|existing",
      email: "new@example.com",
      name: "Updated User",
      picture: null,
    });

    expect(repository.findByAuth0Id).toHaveBeenCalledWith("auth0|existing");
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.updateProfile).toHaveBeenCalledWith("auth0|existing", {
      email: "new@example.com",
      name: "Updated User",
      picture: null,
    });
    expect(user.email).toBe("new@example.com");
  });
});
