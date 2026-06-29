import type { User } from "../../../generated/prisma/client.js";

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

export interface UserRepositoryContract {
  findByAuth0Id(auth0Id: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  updateProfile(auth0Id: string, input: UpdateUserProfileInput): Promise<User>;
}
