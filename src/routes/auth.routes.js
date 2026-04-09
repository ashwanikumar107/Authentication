import { Router } from "express";
import * as authControllers from "../Controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/register", authControllers.register);

authRouter.get("/getMe", authControllers.getMe);

authRouter.post("/login", authControllers.login);

authRouter.get("/logout", authControllers.logout);

export default authRouter;