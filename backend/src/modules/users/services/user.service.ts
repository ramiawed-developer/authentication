import { User } from "../../../generated/prisma/client.js";
import type { CreateUserInput, UserRepositoryContract } from "../repositories/index.js";

export type AuthenticatedUserProfile = {
  auth0Id: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
};

export class UserService {
  constructor(private readonly userRespository: UserRepositoryContract) {}

  async findOrCreateFromAuth0Profile(profile: AuthenticatedUserProfile): Promise<User> {
    const existingUser = await this.userRespository.findByAuth0Id(profile.auth0Id);
    const { auth0Id, ...info } = profile;

    if (existingUser) {
      return this.userRespository.updateProfile(auth0Id, info);
    }

    return this.userRespository.create(profile);
  }

  createUser(input: CreateUserInput): Promise<User> {
    return this.userRespository.create(input);
  }

  findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.userRespository.findByAuth0Id(auth0Id);
  }
}
