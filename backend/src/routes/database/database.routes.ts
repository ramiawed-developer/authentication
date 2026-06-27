import { Router } from "express";
import { prisma } from "../../db/prisma.js";

export const databaseRouter = Router();

databaseRouter.get("/", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
});
