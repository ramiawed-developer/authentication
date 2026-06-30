export type UserRole = "ADMIN" | "USER";

export type CurrentUser = {
  id: string;
  auth0Id: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type MeResponse = {
  user: CurrentUser;
};
