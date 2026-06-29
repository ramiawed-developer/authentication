import type { UserRole } from "../../generated/prisma/enums.js";

export type MeResponse = {
  user: {
    id: string;
    auth0Id: string;
    email: string | null;
    name: string | null;
    picture: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  };
};
