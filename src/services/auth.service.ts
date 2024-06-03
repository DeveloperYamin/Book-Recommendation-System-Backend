/**
 * The above TypeScript code defines functions for logging in with email and password, logging out with
 * a refresh token, and refreshing authentication tokens.
 * @param {string} email - The `email` parameter is a string that represents the email address of the
 * user trying to log in or perform an action that requires authentication.
 * @param {string} password - The `password` parameter in the `loginUserWithEmailAndPassword` function
 * is a string that represents the user's password. It is used to authenticate the user during the
 * login process by matching it with the password stored in the database for the corresponding email
 * address.
 * @returns The code snippet provided contains three functions:
 */

import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { getUserByEmail, getUserById } from '../services/user.service';
import { IUserDoc, IUserWithTokens } from '../interfaces/user.interface';
import { generateAuthTokens, verifyToken } from '../services/token.service';
import { ApiError } from '../utils/errors';
import Token from '../models/token.model';
import { tokenTypes } from '../interfaces/token.interface';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};