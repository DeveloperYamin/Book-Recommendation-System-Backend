# Search Query Functionality

This feature allows users to save their search queries and retrieve their search history. It includes the following components:

## 1. Search Query Model and Interface

The `SearchQuery` model is defined using Mongoose and represents a search query document stored in the database. The model includes the following fields:

- `query` (string, required): The search query string entered by the user.
- `userId` (ObjectId, required): The ID of the user who performed the search query, referencing the `User` model.
- `genres` (string[]): An array of genres associated with the search query.

The `ISearchQueryDoc` interface extends the `ISearchQuery` interface (which defines the properties of a search query) and the `Document` interface from Mongoose, representing a search query document.

## 2. Save Search Query Service

The `saveSearchQuery` function is a service function that saves a new search query to the database. It takes the following parameters:

- `query` (string): The search query string.
- `userId` (mongoose.Types.ObjectId): The ID of the user who performed the search query.
- `genres` (string[]): An array of genres associated with the search query.

This function creates a new `SearchQuery` document using the provided data and returns a Promise that resolves to the saved search query document (`ISearchQueryDoc`).

## 3. Get Search History Service

The `getSearchHistory` function is a service function that retrieves the search history for a specific user. It takes the following parameter:

- `userId` (mongoose.Types.ObjectId): The ID of the user whose search history needs to be retrieved.

This function queries the `SearchQuery` collection to find all search queries associated with the provided `userId`. The search queries are sorted in descending order based on their creation timestamps (`createdAt`). The function returns a Promise that resolves to an array of search query documents (`ISearchQueryDoc[]`).

## 4. User Controller

The `getUser` route handler is added to the user controller. This route is protected by an authentication middleware (`authMiddleware`), ensuring that only authenticated users can access their user details and search history.

When a GET request is made to the `/profile` route, the `getUser` handler is executed. It performs the following steps:

1. Fetch the user details using the `getUserById` service function.
2. Fetch the user's search history using the `getSearchHistory` service function.
3. If the user is not found, throw an `ApiError` with a 404 (NOT_FOUND) status code.
4. Send a response containing the user details and search history.

## 5. User Interface Extension

The `express-serve-static-core` module is extended to add a `user` property to the `Request` interface. This property represents the authenticated user document and allows seamless access to user information throughout the application.

By extending the `Request` interface, you can access the user document directly from the request object in route handlers and middleware functions, making it easier to work with user-related data.