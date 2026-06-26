import { Router } from "express";

export const privateRouter = Router();

privateRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "This is a protected endpoint. You have a valid access token.",
    auth: req.auth,
  });
});
