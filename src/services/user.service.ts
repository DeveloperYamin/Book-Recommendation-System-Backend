/**
 * The above functions handle user creation, registration, and retrieval in a TypeScript application
 * using Mongoose and HTTP status codes.
 * @param {NewCreatedUser} userBody - The `userBody` parameter represents the data or information of a
 * user that is being passed to the functions `createUser` and `registerUser`. It is expected to be an
 * object that conforms to the `NewCreatedUser` interface for `createUser` function and
 * `NewRegisteredUser` interface
 * @returns The code snippet provided includes functions for creating a user, registering a user,
 * getting a user by id, and getting a user by email. Each function returns a Promise that resolves to
 * an IUserDoc (user document) or null.
 */

import httpStatus from "http-status";
import mongoose from "mongoose";
import {
  NewCreatedUser,
  IUserDoc,
  NewRegisteredUser,
} from "../interfaces/user.interface";
import { ApiError } from "../utils/errors";
import User from "../models/user.model";

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (
  userBody: NewCreatedUser
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return User.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (
  userBody: NewRegisteredUser
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return User.create(userBody);
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (
  id: mongoose.Types.ObjectId
): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> =>
  User.findOne({ email });
