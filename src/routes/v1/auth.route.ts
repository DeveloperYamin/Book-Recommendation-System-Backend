/* This TypeScript code is setting up a router using the Express framework for a web application. It
imports the `express` module and the `Router` class from it. It also imports an `authController`
object from the `auth.controller` file. */

import express, { Router } from "express";
import * as authController from "../../controllers/auth.controller";

const router: Router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);

export default router;
