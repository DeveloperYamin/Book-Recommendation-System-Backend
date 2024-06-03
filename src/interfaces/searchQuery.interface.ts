/* This TypeScript code snippet is defining interfaces and types related to a search query
functionality using Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and
Node.js. */

import mongoose, { Document, Model } from "mongoose";

export interface ISearchQuery {
  query: string;
  userId: mongoose.Types.ObjectId;
  genres: string[];
}

export interface ISearchQueryDoc extends ISearchQuery, Document {}

export interface ISearchQueryModel extends Model<ISearchQuery> {}
