/**
 * The above TypeScript code defines an authentication middleware function that uses Passport for JWT
 * authentication in an Express application.
 * @param {Request} req - `req` is the request object representing the HTTP request being made by the
 * client to the server. It contains information about the request such as the URL, headers,
 * parameters, body, etc. In this context, `req` is used within the authentication middleware to
 * extract user information after successful authentication.
 * @param {any} resolve - Resolve is a function that is used to fulfill or resolve a Promise. When
 * called, it indicates that the Promise has been resolved successfully with a certain value. In the
 * provided code snippet, the resolve function is used to indicate successful authentication and
 * execution of the middleware by resolving the Promise.
 * @param {any} reject - The `reject` parameter in the `verifyCallback` function is a function that is
 * used to reject a promise with an error. In this context, it is used to reject the promise if there
 * is an error, info is present, or the user is not found during the authentication process. It creates
 * @returns In the provided code snippet, the `authMiddleware` function is being returned. This
 * function is a middleware function that handles authentication using Passport with JWT strategy. It
 * checks if the user is authenticated and sets the `req.user` object with user information if
 * authentication is successful. The middleware function returns a Promise that resolves when
 * authentication is successful and rejects with an error if authentication fails.
 */

import { Request, Response, NextFunction } from "express";
import passport from "passport";
import httpStatus from "http-status";
import { IUserDoc } from "../interfaces/user.interface";
import { ApiError } from "../utils/errors";

const verifyCallback =
  (req: Request, resolve: any, reject: any) =>
  async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = user;
    resolve();
  };

const authMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
