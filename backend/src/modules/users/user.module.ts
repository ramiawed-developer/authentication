import { prisma } from "../../db/index.js";
import { UserRepository } from "./repositories/index.js";
import { UserService } from "./services/index.js";

const userRepository = new UserRepository(prisma);
export const userService = new UserService(userRepository);
