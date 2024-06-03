/**
 * The above TypeScript code defines functions to generate, save, verify tokens, and generate
 * authentication tokens for users.
 * @param userId - `userId` is the unique identifier of a user in the database, typically stored as a
 * `mongoose.Types.ObjectId`.
 * @param {Moment} expires - The `expires` parameter in the functions `generateToken`, `saveToken`, and
 * `generateAuthTokens` represents the expiration date and time of the token being generated. It is of
 * type `Moment`, which is a moment.js object that represents a point in time. The `expires` parameter
 * is
 * @param {string} type - The `type` parameter in the functions refers to the type of token being
 * generated or verified. It is used to differentiate between different types of tokens such as access
 * tokens and refresh tokens.
 * @param {string} secret - The `secret` parameter in the `generateToken` function is a string that
 * represents the secret key used to sign the JWT token. It is used to encode and decode the token
 * securely. In the provided code snippet, the default value for the `secret` parameter is fetched from
 * the `config.jwt
 * @returns The code snippet provided includes functions for generating tokens, saving tokens,
 * verifying tokens, and generating authentication tokens. The functions return the following:
 */

import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import mongoose from "mongoose";
import httpStatus from "http-status";
import {
  AccessAndRefreshTokens,
  ITokenDoc,
  tokenTypes,
} from "../interfaces/token.interface";
import { IUserDoc } from "../interfaces/user.interface";
import config from "../utils/config";
import { ApiError } from "../utils/errors";
import Token from "../models/token.model";

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string
): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (
  token: string,
  type: string
): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "bad user");
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (
  user: IUserDoc
): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
