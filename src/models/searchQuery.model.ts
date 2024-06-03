/* This code snippet is defining a Mongoose schema and model for a search query document in a
TypeScript environment. Here's a breakdown of what each part is doing: */

import {
  ISearchQueryDoc,
  ISearchQueryModel,
} from "../interfaces/searchQuery.interface";
import mongoose from "mongoose";

const searchQuerySchema = new mongoose.Schema<
  ISearchQueryDoc,
  ISearchQueryModel
>(
  {
    query: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genres: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const SearchQuery = mongoose.model<ISearchQueryDoc, ISearchQueryModel>(
  "SearchQuery",
  searchQuerySchema
);

export default SearchQuery;
