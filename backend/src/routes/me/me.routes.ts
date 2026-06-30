import { Router } from "express";
import { extractAuthenticatedUserProfile } from "../../middleware/auth/index.js";
import { userService } from "../../modules/users/user.module.js";
import { MeResponseSchema } from "@authentication/contracts";
import type { MeResponse } from "@authentication/contracts";

export const meRouter = Router();

meRouter.get("/", async (req, res, next) => {
  try {
    const profile = extractAuthenticatedUserProfile(req);
    const user = await userService.findOrCreateFromAuth0Profile(profile);

    const response: MeResponse = {
      user: {
        id: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };

    const validateResponse = MeResponseSchema.parse(response);

    res.status(200).json(validateResponse);
  } catch (error) {
    next(error);
  }
});
