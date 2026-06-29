import { Router } from "express";
import { extractAuthenticatedUserProfile } from "../../middleware/auth/index.js";
import { userService } from "../../modules/users/user.module.js";

export const meRouter = Router();

meRouter.get("/", async (req, res, next) => {
  try {
    const profile = extractAuthenticatedUserProfile(req as unknown as Request);

    const user = await userService.findOrCreateFromAuth0Profile(profile);

    res.status(200).json({
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
    });
  } catch (error) {
    next(error);
  }
});
