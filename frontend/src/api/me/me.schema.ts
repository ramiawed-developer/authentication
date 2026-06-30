import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const MeResponseSchema = z.object({
  user: z.object({
    id: z.string().min(1),
    auth0Id: z.string().min(1),
    email: z.email().min(1).nullable(),
    name: z.string().min(1).nullable(),
    picture: z.url().nullable(),
    role: UserRoleSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
export type CurrentUser = MeResponse["user"];
