/* This TypeScript code snippet is setting up a router using the Express framework. It imports the
necessary modules such as `express`, `Router`, `bookController`, and `authMiddleware`. */

import express, { Router } from "express";
import * as bookController from "../../controllers/book.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router: Router = express.Router();

router.route("/").get(authMiddleware(), bookController.getBooks);
router.route("/recommendations").get(authMiddleware(), bookController.getBookRecommendations);

export default router;
