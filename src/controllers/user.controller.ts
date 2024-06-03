/* This TypeScript code snippet is importing various modules and functions to handle a request to get
user information and search history. Here is a breakdown of what each import statement is doing: */

import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import * as userService from "../services/user.service";
import { ApiError } from "../utils/errors";
import * as searchQuery from "../services/searchQuery.service";

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user._id);
  const searchHistory = await searchQuery.getSearchHistory(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({ user, searchHistory });
});
