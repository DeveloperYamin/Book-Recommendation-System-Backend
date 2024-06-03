/* This TypeScript code snippet is setting up a router using the Express framework. Here's a breakdown
of what each part is doing: */

import express, { Router } from "express";
import * as userController from "../../controllers/user.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router: Router = express.Router();

router.route("/profile").get(authMiddleware(), userController.getUser);

export default router;
