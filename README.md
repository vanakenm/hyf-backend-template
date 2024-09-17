# Express and MySQL Template

This project template facilitates the development of web applications using Express.js and MySQL. It includes user authentication via cookies and provides a foundation for building APIs to manage recipes or similar entities.

## Getting started

- Clone project locally:

```
git clone https://github.com/juryp/hyf-CareFood-backend.git
```

nodejs 20.x version required

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
├── config
│   ├── db.js           # Database configuration
|-- controllers/
|   ├── userController.js       # Handles user-related operations
|
|-- middleware/
|   ├── verifyToken.js   # Middleware to verify user authentication
|-- models/
|   ├── user.js          # Defines user schema for MySQL
|-- routes/
├── routes
│   ├── boxes.js    # Routes for boxes manipulations
│   ├── offers.js   # Routes for offers operations
│   ├── recipe.js
│   ├── reservations.js # Routes for Reserv and issue and history
│   └── user.js   # Routes for auth and login
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

1. **Install dependencies:**

nodejs 20.x version required

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
    CREATE DATABASE carefood;
  ```

Create users table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    preferences VARCHAR(20)
  );
```

Create providers table

```sql
CREATE TABLE providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    coordinates VARCHAR(100),
    description TEXT
);
```

Create boxes table:

```sql
CREATE TABLE boxes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    type VARCHAR(20),
    description TEXT,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
```

Create weekly plans table:

```sql
CREATE TABLE weekly_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    week_start DATE,
    standard_quantity INT,
    vegan_quantity INT,
    diabetic_quantity INT,
    pickup_time TIME,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
```

Create reservations table:

```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    box_id INT,
    provider_id INT,
    reservation_date DATE,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (box_id) REFERENCES boxes(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
```

[Back to top](#project-structure)

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

**POST /auth/register**

- Registers a new user.
  
  Method POST
  
  URL:

  ```
  http://localhost:5000/auth/register/user
  ```

  Body:

  ```json
  {
    "login": "johnsm",
    "name": "John Smith",
    "email": "johnsm@example.com",
    "phone": "1234567890",
    "password": "password123",
    "preferences": "Standard"
    }
  ```
  
  Response:

  ```json
  {
    "message": "User jury created successfully",
    "id": 1,
    "role": "user",
    "login": "johnsm"
  }

- Registers a new provider.

  Method POST
  
  URL:

  ```
  http://localhost:5000/auth/register/provider
  ```

  Body:

    ```json
    {
    "name": "Supermarket",
    "login": "supermarket_login",
    "email": "contact@supermarket.com",
    "phone": "9876543210",
    "password": "providerpass",
    "address": "123 Main Street",
    "coordinates": "50.1234, 10.5678",
    "description": "Food Provider"
  }
  ```

  Response:

  ```json
  {
    "message": "Provider logged in successfully",
    "id": 3,
    "role": "provider",
    "login": "supermarket_login"
  }
  ```

  **POST /auth/login**

- Logs in an existing user/provider.

  ```
  http://localhost:5000/auth/login
  ```

  Body:

  ```json
  {
    "login": "supermarket_login",
    "password": "providerpass"
  }
  ```

  Respons if successfully:

  ```json
  {
    "message": "Provider logged in successfully",
    "id": 3,
    "role": "provider",
    "login": "supermarket_login"
  }
  ```

  Respons else:

  ```json
  {
    "message": "Invalid login or password"
  }
  ```

- **POST /logout**
  - Logout user.

  ### Offers Routes

  **GET /offers**

  Method GET

  ```
  http://localhost:5000/offers?startDate=2024-09-14&endDate=2024-09-14
  ```

  Response:

  ```json
  [
    {
        "provider_id": 1,
        "week_start": "2024-09-14T00:00:00.000Z",
        "standard_quantity": 1,
        "vegan_quantity": 15,
        "diabetic_quantity": 0,
        "pickup_time": "17:30:00"
    },
    {
        "provider_id": 2,
        "week_start": "2024-09-14T00:00:00.000Z",
        "standard_quantity": 10,
        "vegan_quantity": 4,
        "diabetic_quantity": 2,
        "pickup_time": "17:30:00"
    },
    {
        "provider_id": 3,
        "week_start": "2024-09-14T00:00:00.000Z",
        "standard_quantity": 9,
        "vegan_quantity": 4,
        "diabetic_quantity": 2,
        "pickup_time": "17:30:00"
    }
  ]
  ```

  ### Reservations Routes

- **POST /reservations**

- Make Reservation (authenticated users only).

  Method POST:

  ```
  http://localhost:5000/reservations/
  ```

  Body:

  ```json
  {
    "user_id": 1,
    "provider_id": 3,
    "box_id": 1,
    "reservation_date": "2024-09-14",
    "quantity": 2
  }
  ```

  Response if successfully:

  ```json
  {
    "message": "Reservation successfully created"
  }
  ```

  Response if not enough boxes:

  ```json
  {
    "message": "Not enough boxes available for reservation"
  }
  ```

  Show Reserved Boxes by User #1:

  Method GET:

  ```
  http://localhost:5000/reservations/user/1?date=2024-09-14
  ```

  Response:

  ```json
  [
    {
        "id": 4,
        "reservation_date": "2024-09-14T00:00:00.000Z",
        "quantity": 1,
        "status": "active",
        "type": "Standard",
        "provider_name": "AldiWest",
        "address": "Rue de Intendant 53, 1080 Molenbeek-Saint-Jean"
    },
    {
        "id": 9,
        "reservation_date": "2024-09-14T00:00:00.000Z",
        "quantity": 4,
        "status": "active",
        "type": "Standard",
        "provider_name": "Lidl138Gray",
        "address": "Rue Gray 138, 1050 Ixelles"
    }
  ]
  ```

  Show Reserved Boxes in Shop 1

  Method POST:

  ```
  http://localhost:5000/reservations/provider/1?startDate=2024-09-14&endDate=2024-09-14
  ```

  Response:

  ```json
  [
    {
        "id": 18,
        "reservation_date": "2024-09-14",
        "quantity": 1,
        "status": "active",
        "type": "Standard",
        "user_name": "John Doe",
        "email": "john.doe@example.com"
    },
    {
        "id": 19,
        "reservation_date": "2024-09-14",
        "quantity": 2,
        "status": "active",
        "type": "Standard",
        "user_name": "Felix Doe",
        "email": "felix.doe@example.com"
    }
  ]
  ```

  Issue a Specific Reservation by ID

  Method POST:

  Issue Reservation ID 18

  ```
  http://localhost:5000/reservations/issue/18
  ```

  Response:

  ```json
  {
    "message": "Reservation has been successfully issued"
  }
  ```

  Issue All Reservations for a User on a Specific Date

  Method POST:

  ```
  http://localhost:5000/reservations/issue/all
  ```

  Body:

  ```json
  {
    "provider_id": 1,
    "user_id": 2,
    "issue_date": "2024-09-14"
  }
  ```

  Response:

  ```json
  {
    "message": "All reservations for the user on this date have been issued"
  }
  ```

  **Reservation History**

  For Providers:

  Method GET:

  ```
  http://localhost:5000/reservations/provider/1/history?startDate=2024-09-15&endDate=2024-09-17
  ```

  Respons:

  ```json
  [
    {
        "id": 9,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 4,
        "type": "Standard",
        "user_name": "John Smith",
        "email": "john@example.com"
    },
    {
        "id": 10,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 2,
        "type": "Diabetic",
        "user_name": "John Smith",
        "email": "john@example.com"
    },
    {
        "id": 11,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 2,
        "type": "Standard",
        "user_name": "John Smith",
        "email": "john@example.com"
    },
    {
        "id": 18,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 1,
        "type": "Standard",
        "user_name": "John Doe",
        "email": "john.doe@example.com"
    },
    {
        "id": 29,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 1,
        "type": "Standard",
        "user_name": "John Smith",
        "email": "john@example.com"
    }
  ]
  ```

  For Users:

  Method GET:

  ```
  http://localhost:5000/reservations/user/1/history?startDate=2024-09-16&endDate=2024-09-17
  ```

  Respons:

  ```json
  [
    {
        "id": 9,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 4,
        "type": "Standard",
        "provider_name": "Lidl138Gray",
        "address": "Rue Gray 138, 1050 Ixelles"
    },
    {
        "id": 10,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 2,
        "type": "Diabetic",
        "provider_name": "Lidl138Gray",
        "address": "Rue Gray 138, 1050 Ixelles"
    },
    {
        "id": 11,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 2,
        "type": "Standard",
        "provider_name": "Lidl138Gray",
        "address": "Rue Gray 138, 1050 Ixelles"
    },
    {
        "id": 29,
        "issued_date": "2024-09-17T00:00:00.000Z",
        "quantity": 1,
        "type": "Standard",
        "provider_name": "Lidl138Gray",
        "address": "Rue Gray 138, 1050 Ixelles"
    }
  ]
  ```

  ### Boxes Routes

  **PUT /boxes/add-boxes**

  Add 7 Standard Boxes for Provider on 14th Sep

  Method PUT:

  ```
  http://localhost:5000/boxes/add-boxes
  ```

  Body:

  ```json
  {
    "provider_id": 1,
    "week_start": "2024-09-14",
    "type": "standard",
    "quantity": 7
  }
  ```

  Response:

  ```json
  {
    "message": "Box quantity updated successfully"
  }
  ```

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
