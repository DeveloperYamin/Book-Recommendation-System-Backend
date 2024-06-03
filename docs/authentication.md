# User Authentication and Token Management

This document provides an overview of the user authentication and token management system implemented in the application.

## User Authentication

The application supports user registration and login with email and password. The `auth.controller.ts` file defines the Express routes for handling these operations.

### User Registration

Users can register by providing their name, email, and password. The `registerUser` function in `user.service.ts` is responsible for creating a new user document in the database after validating the uniqueness of the email address.

### User Login

Users can log in by providing their email and password. The `loginUserWithEmailAndPassword` function in `auth.service.ts` authenticates the user by checking if the provided email and password match a user in the database.

## Token Management

The application uses JSON Web Tokens (JWT) for authentication and authorization purposes. It generates and manages access and refresh tokens for authenticated users.

### Access Tokens

Access tokens are short-lived tokens used for authenticating API requests. They are generated using the `generateAuthTokens` function in `token.service.ts` and have an expiration time defined in the application configuration (`config.jwt.accessExpirationMinutes`).

### Refresh Tokens

Refresh tokens are long-lived tokens used to obtain new access tokens when the current access token expires. They are generated alongside access tokens using the `generateAuthTokens` function and stored in the database using the `saveToken` function from `token.service.ts`. The expiration time for refresh tokens is defined in the application configuration (`config.jwt.refreshExpirationDays`).

### Token Verification

Incoming requests are authenticated using the `authMiddleware` function, which verifies the provided JWT token using the Passport.js JWT strategy defined in `passport.ts`. If the token is valid, the middleware sets the `req.user` object with the user information, allowing the request to proceed.

### Token Refresh

When an access token expires, clients can use their refresh token to obtain a new set of access and refresh tokens. The `refreshAuth` function in `auth.service.ts` handles this process by verifying the provided refresh token, revoking the old refresh token, and generating new access and refresh tokens.

### Logout

Users can log out by providing their refresh token. The `logout` function in `auth.service.ts` finds and deletes the corresponding refresh token document from the database, effectively revoking the refresh token and preventing further token refreshes.

## Password Handling

The application uses bcrypt.js for hashing and verifying user passwords. The `user.model.ts` file defines a pre-save hook that hashes the user's password before saving it to the database. The `isPasswordMatch` method on the user model verifies if a provided password matches the hashed password stored in the database.

## Interfaces and Models

The `token.interface.ts` and `user.interface.ts` files define the interfaces and types used throughout the authentication and token management system. The `token.model.ts` and `user.model.ts` files define the Mongoose schemas for the token and user models, respectively.

## Error Handling

The application uses a custom `ApiError` class defined in `errors.ts` to handle and propagate errors related to authentication and token management. This class extends the standard `Error` class and includes an HTTP status code for better error handling and response formatting.

## Configuration

The application configuration, including JWT secret keys and token expiration times, is defined in the `config.ts` file. This file should be treated as sensitive and should not be committed to version control.

## Dependencies

The authentication and token management system relies on the following dependencies:

- `jsonwebtoken`: For generating and verifying JSON Web Tokens.
- `bcryptjs`: For hashing and verifying passwords.
- `passport` and `passport-jwt`: For implementing JWT authentication strategy using Passport.js.
- `http-status`: For better error handling and HTTP status code management.
- `mongoose`: For interacting with MongoDB and defining data models.