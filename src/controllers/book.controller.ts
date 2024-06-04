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
import NodeCache from "node-cache";
import RateLimiter from "bottleneck";

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

const rateLimiter = new RateLimiter({
  reservoir: 5,
  reservoirRefreshAmount: 5,
  reservoirRefreshInterval: 1000,
});

const genreCache = new NodeCache({
  stdTTL: 3600, // Default cache expiration time (1 hour)
  checkperiod: 600, // Check for expired keys every 10 minutes
  maxKeys: 1000, // Maximum number of keys to store
});

export const getBookRecommendations = catchAsync(
  async (req: Request, res: Response) => {
    const userPreferredGenres = await searchQuery.getPreferredGenres(
      req.user._id
    );
    const recommendations: Volume[] = [];

    if (userPreferredGenres.length) {
      // Content-based filtering based on user's preferred genres
      await Promise.all(
        userPreferredGenres.map(async (genre) => {
          // Check if the genre results are cached
          const cachedData = genreCache.get<Volume[]>(genre);

          if (cachedData) {
            recommendations.push(...cachedData);
          } else {
            // Rate limit the API requests
            await rateLimiter.schedule(async () => {
              const url = new URL(
                "https://www.googleapis.com/books/v1/volumes"
              );
              url.searchParams.set("q", `subject:${genre}`);
              url.searchParams.set("orderBy", "relevance");
              url.searchParams.set("maxResults", "1");
              url.searchParams.set("key", config.booksApiKey);

              try {
                const { data } = await axios.get(url.toString());
                if (data && data.items) {
                  const volumeData: Volume[] = data.items;
                  recommendations.push(...volumeData);
                  // Cache the genre results
                  genreCache.set(genre, volumeData);
                }
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  if (error.response?.status === 429) {
                    console.error(
                      "Too Many Requests error, retrying after 1 second..."
                    );
                    // Retry the request after 1 second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    await rateLimiter.schedule(async () => {
                      const { data } = await axios.get(url.toString());
                      if (data && data.items) {
                        const volumeData: Volume[] = data.items;
                        recommendations.push(...volumeData);
                        // Cache the genre results
                        genreCache.set(genre, volumeData);
                      }
                    });
                  } else {
                    console.error(
                      `Error fetching books for genre ${genre}: ${error.message}`
                    );
                  }
                } else {
                  console.error(
                    `Error fetching books for genre ${genre}: ${error}`
                  );
                }
              }
            });
          }
        })
      );
    }

    const bookRecommendations = recommendations.map((item) => ({
      title: item.volumeInfo.title,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
      authors: item.volumeInfo.authors || [],
    }));

    res.send(bookRecommendations);
  }
);
