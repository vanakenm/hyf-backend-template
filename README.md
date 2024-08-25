# Express and MySQL Template

This project template facilitates the development of web applications using Express.js and MySQL. It includes user authentication via cookies and provides a foundation for building APIs to manage recipes or similar entities.

## Getting started

- Create a new project based on this template for your team: https://github.com/new?template_name=hyf-backend-template&template_owner=vanakenm (once)
- Clone your new project locally (everyone)
- Locally run:

    npm i
    
    npm run dev

This should get you a server running on port 5000. To test, open your browser and go to:

    http://localhost:5000/recipes

You should see a list of recipes.

## Introduction

This template is designed to help developers create a robust web application backend using Express.js and MySQL. It focuses on user registration, authentication, and authorization, allowing authenticated users to manage recipes (or similar entities) through defined APIs.

## Description

- Implement various APIs using Express.js (e.g., Recipes).
- Support user registration and login functionality.
- Non-authenticated users can view all recipes but cannot modify them.
- Authenticated users can perform CRUD (Create, Read, Update, Delete) operations on recipes.

## Project Structure

```plaintext
Project/
|-- config/
|   ├── db.js           # Database configuration
|-- controllers/
|   ├── userController.js       # Handles user-related operations
|
|-- middleware/
|   ├── verifyToken.js   # Middleware to verify user authentication
|-- models/
|   ├── user.js          # Defines user schema for MySQL
|-- routes/
|   ├── userRoutes.js    # Routes for user-related endpoints
|
|-- utils/
|   ├── hashPassword.js      # Utility to hash user passwords
|   ├── matchPasswords.js    # Utility to compare passwords
|   ├── validateEmail.js     # Utility to validate email format
|   ├── validatePasswords.js # Utility to validate password complexity
|-- .babelrc          # Babel configuration for ES6 support
|-- .env              # Environment variables configuration
|-- index.js          # Entry point of the application
|-- package.json      # Dependencies and scripts
|-- README.md         # This file
```

## Setup Instructions

1. **Use this Template Repo:**
   [Use this template to create your repo](https://github.com/HackYourFutureBelgium/node-template)

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Create a `.env` file in the root directory and add the following:

     ```plaintext
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     SECRET_KEY=your_secret_key
     ```

4. **Create a database:**
    ```sql
    CREATE DATABASE your_database_name;
    ```
    
5. **Run the application:**

   ```bash
   npm run dev
   ```

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

```plaintext
PORT=5002
TOKEN_ACCESS_SECRET=your_token_secret
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
```

## Routes

### User Routes

- **POST /register**

  - Registers a new user.

- **POST /login**
  - Logs in an existing user.

- **POST /logout**
  - Logout user.

### Recipe Routes

- **GET /recipes**

  - Retrieves all recipes.

- **POST /recipes**

  - Creates a new recipe (authenticated users only).

- **GET /recipes/:id**

  - Retrieves a single recipe by ID.

- **PUT /recipes/:id**

  - Updates a recipe by ID (authenticated users only).

- **DELETE /recipes/:id**
  - Deletes a recipe by ID (authenticated users only).

## Controllers

### User Controller

Handles user registration, login, and other user-related actions.

### Recipe Controller

Manages CRUD operations for recipes.

## Middleware Functions

### Verify Token

Middleware function to verify user tokens for authentication purposes.

## Utility Functions

### hashPassword.js

Utility to hash user passwords for secure storage.

### matchPasswords.js

Utility to compare password and confirmPassword.

### validateEmail.js

Utility to validate email format.

### validatePasswords.js

Utility to ensure passwords meet required complexity criteria.

## Authentication

- Users must register and log in to perform certain actions.
- Authentication is handled using cookies.
- The `verifyToken` middleware function ensures that only authenticated users can access restricted routes.

## Resources

- [Express Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://www.npmjs.com/package/mysql2)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Cookie Parser Middleware](https://www.npmjs.com/package/cookie-parser)
