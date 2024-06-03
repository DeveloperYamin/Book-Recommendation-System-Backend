/* This TypeScript code snippet is defining two functions related to fetching book data using the
Google Books API. Here's a breakdown of what the code is doing: */

import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import pick from "../utils/pick";
import axios from "axios";
import config from "../utils/config";
import { generate } from "random-words";
import * as searchQuery from "../services/searchQuery.service";
import { BookResponse, Volume } from "../interfaces/book.interface";

export const getBooks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["search_query"]);
  let books: BookResponse;

  const url = new URL("https://www.googleapis.com/books/v1/volumes");

  if (Object.keys(filter).length) {
    url.searchParams.set("q", filter.search_query);
    url.searchParams.set("key", config.booksApiKey);
    const { data } = await axios.get(url.toString());
    books = data;

    if (req.user._id) {
      const genres = books.items.flatMap(
        (item) => item.volumeInfo.categories || []
      );
      await searchQuery.saveSearchQuery(
        filter.search_query,
        req.user._id,
        genres
      );
    }
  } else {
    url.searchParams.set("q", generate({ exactly: 2, join: " " }));
    url.searchParams.set("key", config.booksApiKey);
    const { data } = await axios.get(url.toString());
    books = data;
  }
  res.send(
    books.items.map((item) => ({
      title: item.volumeInfo.title,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
      authors: item.volumeInfo.authors || [],
    }))
  );
});

export const getBookRecommendations = catchAsync(
  async (req: Request, res: Response) => {
    const userPreferredGenres = await searchQuery.getPreferredGenres(
      req.user._id
    );
    const recommendations: Volume[] = [];
    if (userPreferredGenres.length) {
      // Content-based filtering based on user's preferred genres
      for (const genre of userPreferredGenres) {
        const url = new URL("https://www.googleapis.com/books/v1/volumes");
        url.searchParams.set("q", `subject:${genre}`);
        url.searchParams.set("orderBy", "relevance");
        url.searchParams.set("maxResults", "5");
        url.searchParams.set("key", config.booksApiKey);
        const { data } = await axios.get<BookResponse>(url.toString());
        if (data && data.items) {
          recommendations.push(...data.items);
        }
      }
    }
    res.send(
      recommendations.map((item) => ({
        title: item.volumeInfo.title,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
        authors: item.volumeInfo.authors || [],
      }))
    );
  }
);
