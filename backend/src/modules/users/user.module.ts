import { prisma } from "../../db/index.js";
import { PrismaUserRepository } from "./repositories/index.js";
import { UserService } from "./services/index.js";

const userRepository = new PrismaUserRepository(prisma);
export const userService = new UserService(userRepository);
