import { Express } from "express";
import authRouter from "./auth";

export default function router(app: Express) {
  app.use("/api/auth", authRouter)
}