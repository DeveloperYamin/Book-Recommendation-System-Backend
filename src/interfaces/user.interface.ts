/* The code snippet you provided is defining a set of interfaces and types related to user management
in a TypeScript application using Mongoose, a MongoDB object modeling tool. Here is a breakdown of
what each part of the code is doing: */

import mongoose, { Model, Document } from "mongoose";
import { AccessAndRefreshTokens } from "../interfaces/token.interface";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = IUser;

export type NewCreatedUser = IUser;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}

export interface IReqUser {
  id: mongoose.Types.ObjectId,
  email: string,
}
