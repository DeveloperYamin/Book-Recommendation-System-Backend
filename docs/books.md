# Book Search and Recommendation

This module provides functionality for searching books from the Google Books API and retrieving personalized book recommendations based on the user's preferred genres.

## Book Search

The `getBooks` function fetches book data from the Google Books API based on a search query or retrieves random books if no query is provided. It returns an array of book objects containing the title, thumbnail image URL, and authors.

The search query and associated genres are stored in the database for the authenticated user. This information is used later for generating personalized book recommendations.

### Usage

```typescript
import { getBooks } from './controllers/book.controller';

// Fetch books based on a search query
const books = await getBooks(req, res);

// Fetch random books
const randomBooks = await getBooks(req, res);