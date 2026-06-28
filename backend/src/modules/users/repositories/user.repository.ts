import { PrismaClient, type User } from "../../../generated/prisma/client.js";

export type CreateUserInput = {
  auth0Id: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
};

export type UpdateUserProfileInput = {
  email?: string | null;
  name?: string | null;
  picture?: string | null;
};

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
  }

  create(input: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        auth0Id: input.auth0Id,
        email: input.email ?? null,
        name: input.name ?? null,
        picture: input.picture ?? null,
      },
    });
  }

  updateProfile(auth0Id: string, input: UpdateUserProfileInput): Promise<User> {
    return this.prisma.user.update({
      where: { auth0Id },
      data: {
        email: input.email ?? null,
        name: input.name ?? null,
        picture: input.picture ?? null,
      },
    });
  }
}
